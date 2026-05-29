import type { MiddlewareHandler } from 'astro';

// Content Security Policy. 'unsafe-inline' is required because the site uses
// inline scripts (Google Analytics, newsletter form) and inline styles.
// Google Tag Manager / Analytics origins are whitelisted explicitly.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const securityHeaders: Record<string, string> = {
  'Content-Security-Policy': csp,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  // Tells browsers to always use HTTPS for this domain for 1 year.
  // Apache passes this header through to the client even though TLS
  // terminates at the proxy level.
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

export const onRequest: MiddlewareHandler = async (_context, next) => {
  const response = await next();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
};
