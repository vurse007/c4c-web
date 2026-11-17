import "server-only";

export type Contact = { email?: string; phone?: string };

const KEY_PATTERN = /^[a-z0-9-]{1,32}$/;
export const MAX_KEYS = 12;

/** Org-wide contact comes from CONTACT_EMAIL / CONTACT_PHONE; every other
 *  card (chapters, designer) comes from the CONTACTS_JSON env var:
 *  {"irvine":{"email":"…","phone":"…"}, …}. All server-only. */
export function readContacts(keys: string[]): {
  main: Contact | null;
  others: Record<string, Contact>;
} | null {
  const email = process.env.CONTACT_EMAIL;
  const phone = process.env.CONTACT_PHONE;
  if (!email || !phone) return null;

  let table: Record<string, Contact> = {};
  const raw = process.env.CONTACTS_JSON;
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        table = parsed as Record<string, Contact>;
      }
    } catch {
      return null; // misconfigured: fail closed
    }
  }

  const others: Record<string, Contact> = {};
  for (const key of keys) {
    if (key === "main" || !KEY_PATTERN.test(key)) continue;
    const entry = Object.hasOwn(table, key) ? table[key] : undefined;
    if (entry) others[key] = { email: entry.email, phone: entry.phone };
  }
  return { main: { email, phone }, others };
}
