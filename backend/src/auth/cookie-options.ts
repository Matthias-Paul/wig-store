import type { CookieOptions } from 'express';

type SameSite = 'lax' | 'strict' | 'none';

/**
 * Cookie settings for auth tokens.
 *
 * Prefer SameSite=Lax + Secure when the browser talks to the API as first-party
 * (Next.js same-origin rewrite /api/v1 → Nest). That avoids iOS ITP blocking
 * third-party cookies used with SameSite=None across different sites.
 *
 * Set COOKIE_SAME_SITE=none only if the frontend and API are truly cross-site
 * (e.g. Vercel + Render on different domains) AND you accept iOS limitations.
 */
export function authCookieOptions(maxAgeMs?: number): CookieOptions {
  const raw = (process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();
  const sameSite: SameSite =
    raw === 'none' || raw === 'strict' || raw === 'lax' ? raw : 'lax';

  // Local http://localhost needs Secure=false; production should use Secure=true
  const secure =
    sameSite === 'none'
      ? true
      : process.env.COOKIE_SECURE === 'true'
        ? true
        : process.env.COOKIE_SECURE === 'false'
          ? false
          : process.env.NODE_ENV === 'production';

  const options: CookieOptions = {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
  };

  // Only set when FE and API share a parent domain AND you are NOT using a
  // same-origin Next proxy (host-only cookies on the site domain are better).
  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  if (maxAgeMs !== undefined) {
    options.maxAge = maxAgeMs;
  }

  return options;
}
