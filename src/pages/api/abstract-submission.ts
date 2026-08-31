import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';

const ALLOWED_ORIGINS = [
  'https://icd2027.org',
  'https://www.icd2027.org',
  'https://icd11.biol.pmf.hr',
  'http://localhost:4321',
  'http://localhost:4322',
  'http://localhost:4323',
];

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['.doc', '.docx'];
const ALLOWED_TYPES = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/octet-stream',
];

const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbwIiqXk6h1QH7e5btGCuuRpIphH98uEhsR8gDEdqslVUYWZbP1JRgfkW2jF1RgmPBU/exec';

const rateLimitStore = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateLimitStore.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  rateLimitStore.set(ip, hits);

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

function safeSegment(value: string): string {
  const cleaned = value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return cleaned || 'author';
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function timestampName(): string {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function getExtension(filename: string): string {
  const match = filename.toLowerCase().match(/\.(docx?)$/);
  return match ? match[0] : '';
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

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return json({ error: 'Invalid form data.' }, 400, origin);
    }

    const website = String(formData.get('website') ?? '').trim();
    if (website !== '') {
      return json(
        { success: true, message: 'Your abstract has been received.' },
        200,
        origin,
      );
    }

    const firstName = String(formData.get('firstName') ?? '').trim();
    const middleName = String(formData.get('middleName') ?? '').trim();
    const lastName = String(formData.get('lastName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const file = formData.get('file');

    if (!firstName || !lastName || !email) {
      return json({ error: 'Please complete all required fields.' }, 400, origin);
    }

    if (
      firstName.length > 100 ||
      middleName.length > 100 ||
      lastName.length > 100 ||
      email.length > 254
    ) {
      return json({ error: 'Input is too long.' }, 400, origin);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return json({ error: 'Please enter a valid email address.' }, 400, origin);
    }

    if (!(file instanceof File) || file.size === 0) {
      return json({ error: 'Please attach a Word document (.doc or .docx).' }, 400, origin);
    }

    if (file.size > MAX_FILE_BYTES) {
      return json({ error: 'The file must be 5 MB or smaller.' }, 400, origin);
    }

    const extension = getExtension(file.name);
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return json(
        { error: 'Only Word documents (.doc or .docx) are accepted.' },
        400,
        origin,
      );
    }

    if (file.type && !ALLOWED_TYPES.includes(file.type)) {
      return json(
        { error: 'Only Word documents (.doc or .docx) are accepted.' },
        400,
        origin,
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const nameParts = [safeSegment(lastName), safeSegment(firstName)];
    if (middleName) {
      nameParts.push(safeSegment(middleName));
    }
    const storedName = `${nameParts.join('_')}_${timestampName()}${extension}`;

    const scriptUrl =
      process.env.GOOGLE_ABSTRACT_SCRIPT_URL ||
      import.meta.env.GOOGLE_ABSTRACT_SCRIPT_URL ||
      DEFAULT_SCRIPT_URL;

    const payload = {
      firstName,
      middleName,
      lastName,
      email,
      fileName: storedName,
      mimeType:
        file.type ||
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileData: buffer.toString('base64'),
    };

    const gasResponse = await fetch(scriptUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const raw = await gasResponse.text();
    let gasData: { success?: boolean; error?: string } = {};
    try {
      gasData = JSON.parse(raw) as typeof gasData;
    } catch {
      console.error('Abstract upload: non-JSON response from Apps Script', {
        status: gasResponse.status,
        preview: raw.slice(0, 300),
      });
      return json(
        {
          error:
            'The upload service is not ready yet. Please try again later, or contact the organisers.',
        },
        502,
        origin,
      );
    }

    if (!gasResponse.ok || gasData.success === false) {
      console.error('Abstract upload: Apps Script error', {
        status: gasResponse.status,
        error: gasData.error,
      });
      return json(
        { error: 'There was an error saving your abstract. Please try again.' },
        502,
        origin,
      );
    }

    return json(
      {
        success: true,
        message: 'Your abstract has been received.',
        firstName,
      },
      200,
      origin,
    );
  } catch (error) {
    console.error('Abstract submission error:', error);
    return json(
      { error: 'An unexpected error occurred. Please try again later.' },
      500,
      origin,
    );
  }
};

export const OPTIONS: APIRoute = ({ request }) => {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
};
