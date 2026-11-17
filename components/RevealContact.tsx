"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { Mail, Phone } from "lucide-react";

type Contact = { email?: string; phone?: string };
type Revealed = Contact & { contacts?: Record<string, Contact> };

type Status = "idle" | "challenge" | "verifying" | "revealed" | "error";
type Tone = "dark" | "light";

type RevealState = {
  status: Status;
  error: string | null;
  data: Revealed | null;
  attempt: number;
  start: () => void;
  retry: () => void;
  onToken: (token: string) => void;
  onExpire: () => void;
  onWidgetError: () => void;
};

const RevealContext = createContext<RevealState | null>(null);

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const MESSAGES = {
  expired: "The check expired before it finished. Please try again.",
  widget: "The security check couldn't load. Check your connection or ad blocker, then try again.",
  failed: "We couldn't verify you. Please try again.",
  limited: "Too many attempts. Please wait a minute, then try again.",
  server: "Something went wrong on our end. Please try again shortly.",
  network: "Network error. Check your connection and try again.",
  noKey: "The security check isn't configured on this site.",
} as const;

const telHref = (phone: string) =>
  `tel:${phone.startsWith("+") ? "" : "+1"}${phone.replace(/[^\d]/g, "")}`;

/** Owns the whole reveal flow so several places on a page can share ONE
 *  Turnstile challenge (tokens are single-use, so one token = one fetch). */
export function RevealProvider({
  keys = [],
  children,
}: {
  keys?: string[];
  children: ReactNode;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Revealed | null>(null);
  const [attempt, setAttempt] = useState(0);
  const keysParam = keys.join(",");

  const fail = useCallback((message: string) => {
    setError(message);
    setStatus("error");
  }, []);

  const start = useCallback(() => {
    if (!SITE_KEY) return fail(MESSAGES.noKey);
    setError(null);
    setStatus("challenge");
  }, [fail]);

  const retry = useCallback(() => {
    setAttempt((n) => n + 1); // remount the widget -> fresh, unspent token
    start();
  }, [start]);

  const onToken = useCallback(
    async (token: string) => {
      setStatus("verifying");
      try {
        const res = await fetch("/api/reveal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, keys: keysParam ? keysParam.split(",") : [] }),
          cache: "no-store",
        });
        if (res.status === 429) return fail(MESSAGES.limited);
        if (res.status === 403 || res.status === 400) return fail(MESSAGES.failed);
        if (!res.ok) return fail(MESSAGES.server);
        setData((await res.json()) as Revealed);
        setStatus("revealed");
      } catch {
        fail(MESSAGES.network);
      }
    },
    [fail, keysParam],
  );

  const onExpire = useCallback(() => {
    // Only matters while the user is still looking at the challenge; once the
    // token has been submitted it no longer needs to stay valid.
    setStatus((s) => {
      if (s !== "challenge") return s;
      setError(MESSAGES.expired);
      return "error";
    });
  }, []);

  const onWidgetError = useCallback(() => fail(MESSAGES.widget), [fail]);

  const value = useMemo<RevealState>(
    () => ({ status, error, data, attempt, start, retry, onToken, onExpire, onWidgetError }),
    [status, error, data, attempt, start, retry, onToken, onExpire, onWidgetError],
  );

  return <RevealContext.Provider value={value}>{children}</RevealContext.Provider>;
}

function useReveal() {
  const ctx = useContext(RevealContext);
  if (!ctx) throw new Error("Reveal components must be inside <RevealProvider>");
  return ctx;
}

const buttonClass = {
  dark: "border border-white/40 px-4 py-2 text-[15px] font-light text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
  light:
    "border border-black/40 px-4 py-2 text-[15px] font-light text-black transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
} as const;

/** The "Show contact info" button -> Turnstile widget -> error/retry UI.
 *  Renders nothing once revealed. */
export function RevealControl({
  tone = "dark",
  announce = false,
  className = "",
}: {
  tone?: Tone;
  /** Add a screen-reader announcement on success (use when the revealed
   *  links elsewhere on the page aren't inside their own live region). */
  announce?: boolean;
  className?: string;
}) {
  const { status, error, attempt, start, retry, onToken, onExpire, onWidgetError } = useReveal();
  const muted = tone === "dark" ? "text-white/60" : "text-black/60";

  return (
    <div className={className}>
      {announce && (
        <p className="sr-only" role="status" aria-live="polite">
          {status === "revealed" ? "Contact information is now shown." : ""}
        </p>
      )}

      {status === "idle" && (
        <button type="button" onClick={start} className={buttonClass[tone]}>
          Show contact info
        </button>
      )}

      {(status === "challenge" || status === "verifying") && (
        <div>
          {status === "challenge" && SITE_KEY && (
            <Turnstile
              key={attempt}
              siteKey={SITE_KEY}
              onSuccess={onToken}
              onExpire={onExpire}
              onError={onWidgetError}
              onTimeout={onExpire}
              options={{ theme: tone === "dark" ? "dark" : "light", size: "flexible" }}
            />
          )}
          {status === "verifying" && (
            <p role="status" aria-live="polite" className={`text-[15px] font-light ${muted}`}>
              Verifying…
            </p>
          )}
        </div>
      )}

      {status === "error" && (
        <div role="alert" className="flex flex-col items-start gap-3">
          <p className={`text-[15px] font-light ${muted}`}>{error}</p>
          <button type="button" onClick={retry} className={buttonClass[tone]}>
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

/** The revealed email / phone links for one contact (`main` = the org
 *  contact; other ids come from the server's CONTACTS_JSON). */
export function RevealedContact({
  id = "main",
  show = "both",
  tone = "dark",
  variant = "plain",
  linkClassName = "",
  iconClassName = "",
  hiddenLabel,
}: {
  id?: string;
  show?: "both" | "email" | "phone";
  tone?: Tone;
  variant?: "plain" | "card";
  linkClassName?: string;
  iconClassName?: string;
  /** Shown (muted) until revealed, e.g. "Hidden until you verify." */
  hiddenLabel?: string;
}) {
  const { status, data } = useReveal();
  const contact: Contact | undefined =
    status === "revealed" && data ? (id === "main" ? data : data.contacts?.[id]) : undefined;

  const plainLink =
    tone === "dark"
      ? "w-fit break-all underline underline-offset-4 transition-colors hover:text-white"
      : "w-fit break-all underline decoration-black/25 underline-offset-2 hover:decoration-black/60";
  const cls = variant === "card" ? linkClassName : `${plainLink} ${linkClassName}`;

  return (
    <div
      aria-live={variant === "card" ? "off" : "polite"}
      className={variant === "card" ? "flex flex-col gap-2" : "flex flex-col gap-3"}
    >
      {!contact && hiddenLabel && status !== "revealed" && (
        <p className="text-sm font-light text-white/40 group-hover:text-white/70">{hiddenLabel}</p>
      )}
      {contact?.phone && show !== "email" && (
        <a href={telHref(contact.phone)} className={cls}>
          {variant === "card" && <Phone className={iconClassName} aria-hidden />}
          {contact.phone}
        </a>
      )}
      {contact?.email && show !== "phone" && (
        <a href={`mailto:${contact.email}`} className={cls}>
          {variant === "card" && <Mail className={iconClassName} aria-hidden />}
          {contact.email}
        </a>
      )}
    </div>
  );
}

/** Self-contained reveal for the org contact: button -> check -> links. */
export default function RevealContact({
  tone = "dark",
  show = "both",
  className = "",
}: {
  tone?: Tone;
  show?: "both" | "email" | "phone";
  className?: string;
}) {
  return (
    <RevealProvider>
      <div className={`flex flex-col gap-3 ${className}`}>
        <RevealedContact tone={tone} show={show} />
        <RevealControl tone={tone} />
      </div>
    </RevealProvider>
  );
}
