/**
 * Public API base used by the browser (no trailing slash).
 *
 * Production (iOS-safe): use same-origin `/api/v1` so cookies are first-party.
 * Next.js rewrites proxy `/api/v1/*` to the Nest app (see next.config.ts).
 *
 * Cross-site absolute URLs (e.g. Render) need SameSite=None cookies and are
 * unreliable on iOS Safari ITP — avoid in production when possible.
 */
export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "/api/v1";

  return raw.replace(/\/$/, "");
}
