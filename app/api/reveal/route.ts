import { NextResponse, type NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { MAX_KEYS, readContacts } from "@/lib/contacts";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const NO_STORE = { "Cache-Control": "no-store" } as const;

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

// --- Rate limiting (Upstash, Vercel KV_* env names) -----------------------
let limiter: Ratelimit | null | undefined;
function getLimiter(): Ratelimit | null {
  if (limiter !== undefined) return limiter;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    console.warn(
      "[reveal] KV_REST_API_URL / KV_REST_API_TOKEN missing: rate limiting is DISABLED.",
    );
    limiter = null;
    return limiter;
  }
  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 m"),
    prefix: "c4c:reveal",
  });
  return limiter;
}

function clientIp(request: NextRequest): string | undefined {
  // On Vercel these are set by the platform edge, not the client.
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || undefined;
}

// --- Turnstile ---------------------------------------------------------------
type SiteverifyResponse = {
  success: boolean;
  hostname?: string;
  metadata?: { result_with_testing_key?: boolean };
};

function hostnameAllowed(res: SiteverifyResponse): boolean {
  const hostname = res.hostname?.toLowerCase();
  if (!hostname) return false;

  const configured = (process.env.SITE_HOSTNAME ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  if (configured.includes(hostname)) return true;

  // Outside production only: localhost, and the hostname Cloudflare's
  // documented test keys return (flagged by result_with_testing_key).
  if (process.env.NODE_ENV !== "production") {
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (res.metadata?.result_with_testing_key === true) return true;
  }
  return false;
}

async function verifyTurnstile(token: string, ip: string | undefined) {
  const secret = process.env.TURNSTILE_SECRET;
  if (!secret) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as SiteverifyResponse;
    // Cloudflare marks a token spent on first successful siteverify, so a
    // replay returns success:false ("timeout-or-duplicate") -> 403 here.
    return data.success === true && hostnameAllowed(data);
  } catch (error) {
    console.error("[reveal] siteverify failed", error);
    return false; // fail closed
  }
}

// --- Handler -----------------------------------------------------------------
export async function POST(request: NextRequest) {
  const ip = clientIp(request);

  const rl = getLimiter();
  if (rl) {
    try {
      const { success } = await rl.limit(ip ?? "unknown");
      if (!success) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a minute and try again." },
          { status: 429, headers: { ...NO_STORE, "Retry-After": "60" } },
        );
      }
    } catch (error) {
      console.error("[reveal] rate limiter error", error);
      return json({ error: "Service unavailable." }, 503); // fail closed
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const { token, keys } = (payload ?? {}) as { token?: unknown; keys?: unknown };
  if (typeof token !== "string" || token.length === 0 || token.length > 2048) {
    return json({ error: "Missing token." }, 400);
  }
  const wanted = Array.isArray(keys)
    ? keys.filter((k): k is string => typeof k === "string").slice(0, MAX_KEYS)
    : [];

  if (!(await verifyTurnstile(token, ip))) {
    return json({ error: "Verification failed." }, 403);
  }

  const contacts = readContacts(wanted);
  if (!contacts?.main) {
    console.error("[reveal] CONTACT_EMAIL / CONTACT_PHONE / CONTACTS_JSON misconfigured");
    return json({ error: "Contact info is not configured." }, 500);
  }
  return json(
    {
      email: contacts.main.email,
      phone: contacts.main.phone,
      ...(Object.keys(contacts.others).length ? { contacts: contacts.others } : {}),
    },
    200,
  );
}
