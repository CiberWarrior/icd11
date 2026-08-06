import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';

// Allowed origins for cross-origin requests. The newsletter form lives on
// these domains; anything else is rejected to prevent abuse from other sites.
const ALLOWED_ORIGINS = [
  'https://icd2027.org',
  'https://www.icd2027.org',
  'https://icd11.biol.pmf.hr',
  'http://localhost:4321',
  'http://localhost:4322',
];

// In-memory rate limiter. PM2 runs a single fork instance, so this Map is
// shared across requests. Limits one IP to MAX_REQUESTS per WINDOW_MS.
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;
const rateLimitStore = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitStore.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  rateLimitStore.set(ip, hits);

  // Opportunistic cleanup to avoid unbounded growth.
  if (rateLimitStore.size > 5000) {
    for (const [key, times] of rateLimitStore) {
      if (times.every((t) => now - t >= WINDOW_MS)) {
        rateLimitStore.delete(key);
      }
    }
  }

  return hits.length > MAX_REQUESTS;
}

function getClientIp(request: Request, clientAddress: string): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return clientAddress || 'unknown';
}

function corsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  };
}

function json(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders(origin),
  });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const origin = request.headers.get('origin');

  try {
    const ip = getClientIp(request, clientAddress);
    if (isRateLimited(ip)) {
      return json(
        { error: 'Too many requests. Please try again later.' },
        429,
        origin,
      );
    }

    // Parse JSON body
    let data: Record<string, unknown>;
    try {
      const text = await request.text();
      if (!text || text.trim() === '') {
        return json({ error: 'Request body is empty' }, 400, origin);
      }
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      return json({ error: 'Invalid JSON in request body' }, 400, origin);
    }

    if (!data || Object.keys(data).length === 0) {
      return json({ error: 'Request body is empty' }, 400, origin);
    }

    const { name, surname, email, country, newsletterConsent, website } = data;

    // Honeypot: real users never fill the hidden "website" field. If it is
    // present, silently pretend success so bots get no useful signal.
    if (typeof website === 'string' && website.trim() !== '') {
      return json(
        { success: true, message: 'Successfully subscribed to newsletter' },
        200,
        origin,
      );
    }

    // Validation - all fields are required for quality mailing list data.
    if (!name || !surname || !email || !country || !newsletterConsent) {
      return json({ error: 'All fields are required' }, 400, origin);
    }

    // Length limits to reject obviously malicious / oversized input.
    const nameStr = String(name);
    const surnameStr = String(surname);
    const countryStr = String(country);
    const emailStr = String(email);
    if (
      nameStr.length > 100 ||
      surnameStr.length > 100 ||
      countryStr.length > 100 ||
      emailStr.length > 254
    ) {
      return json({ error: 'Input is too long' }, 400, origin);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      return json({ error: 'Invalid email address' }, 400, origin);
    }

    // Prefer process.env so production (PM2 + server .env) works even when
    // the build was made without local Mailchimp credentials. import.meta.env
    // is a fallback for local `astro dev` / builds that inline .env values.
    const MAILCHIMP_API_KEY =
      process.env.MAILCHIMP_API_KEY || import.meta.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID =
      process.env.MAILCHIMP_LIST_ID || import.meta.env.MAILCHIMP_LIST_ID;
    const MAILCHIMP_SERVER =
      process.env.MAILCHIMP_SERVER || import.meta.env.MAILCHIMP_SERVER; // e.g. 'us1'

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER) {
      console.error('Mailchimp credentials not configured', {
        hasApiKey: !!MAILCHIMP_API_KEY,
        hasListId: !!MAILCHIMP_LIST_ID,
        hasServer: !!MAILCHIMP_SERVER,
      });
      return json(
        {
          error:
            'Newsletter service is not configured. Please contact the administrator.',
        },
        500,
        origin,
      );
    }

    // Mailchimp API endpoint
    const mailchimpUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

    // Prepare Mailchimp payload
    const mailchimpData = {
      email_address: emailStr,
      status: 'subscribed' as const,
      merge_fields: {
        FNAME: nameStr,
        LNAME: surnameStr,
        COUNTRY: countryStr,
      },
    };

    // Add to Mailchimp
    // Mailchimp API v3 uses Basic Auth with API key as password
    const authString = Buffer.from(`apikey:${MAILCHIMP_API_KEY}`).toString(
      'base64',
    );

    const response = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailchimpData),
    });

    let responseData: { title?: string; detail?: string };
    try {
      responseData = (await response.json()) as typeof responseData;
    } catch (e) {
      console.error('Mailchimp API non-JSON response', e);
      return json(
        {
          error: 'Invalid response from Mailchimp API. Please try again later.',
        },
        500,
        origin,
      );
    }

    if (!response.ok) {
      // Handle the one error we surface to users explicitly.
      if (response.status === 400 && responseData.title === 'Member Exists') {
        return json(
          { error: 'This email is already subscribed to our newsletter.' },
          400,
          origin,
        );
      }

      // Log full detail server-side, but return a generic message so we don't
      // leak Mailchimp internals to the client.
      console.error('Mailchimp API error:', {
        status: response.status,
        detail: responseData.detail,
        title: responseData.title,
      });

      return json(
        { error: 'Failed to subscribe. Please try again later.' },
        502,
        origin,
      );
    }

    return json(
      { success: true, message: 'Successfully subscribed to newsletter' },
      200,
      origin,
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return json(
      { error: 'An unexpected error occurred. Please try again later.' },
      500,
      origin,
    );
  }
};

// Handle OPTIONS request for CORS preflight
export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
};
