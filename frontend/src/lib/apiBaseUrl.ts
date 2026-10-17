/**
 * Resolves the public API base URL (no trailing slash).
 * Prefer NEXT_PUBLIC_API_BASE_URL; falls back to NEXT_PUBLIC_BACKEND_URL for older envs.
 */
export function getApiBaseUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "";

  return raw.replace(/\/$/, "");
}
