import type { APIRoute } from 'astro';
import { Buffer } from 'node:buffer';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse JSON body
    let data;
    try {
      const text = await request.text();
      
      if (!text || text.trim() === '') {
        return new Response(
          JSON.stringify({ error: 'Request body is empty' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      
      data = JSON.parse(text);
    } catch (parseError) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid JSON in request body',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    if (!data || Object.keys(data).length === 0) {
      return new Response(
        JSON.stringify({ error: 'Request body is empty' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    const { name, surname, email, country, newsletterConsent } = data;

    // Validation - all fields are required
    if (!name || !surname || !email || !country || !newsletterConsent) {
      return new Response(
        JSON.stringify({ error: 'All fields are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get Mailchimp credentials from environment variables
    const MAILCHIMP_API_KEY = import.meta.env.MAILCHIMP_API_KEY;
    const MAILCHIMP_LIST_ID = import.meta.env.MAILCHIMP_LIST_ID;
    const MAILCHIMP_SERVER = import.meta.env.MAILCHIMP_SERVER; // e.g., 'us1', 'us2', etc.

    if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER) {
      console.error('Mailchimp credentials not configured');
      return new Response(
        JSON.stringify({
          error: 'Newsletter service is not configured. Please contact the administrator.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Mailchimp API endpoint
    const mailchimpUrl = `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

    // Prepare Mailchimp payload
    const mailchimpData = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: name,
        LNAME: surname,
        COUNTRY: country,
      },
    };

    // Add to Mailchimp
    // Mailchimp API v3 uses Basic Auth with API key as password
    const authString = Buffer.from(`apikey:${MAILCHIMP_API_KEY}`).toString('base64');
    
    const response = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authString}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailchimpData),
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      console.error('Mailchimp API non-JSON response');
      return new Response(
        JSON.stringify({
          error: 'Invalid response from Mailchimp API. Please try again later.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!response.ok) {
      // Handle Mailchimp errors
      if (response.status === 400 && responseData.title === 'Member Exists') {
        return new Response(
          JSON.stringify({
            error: 'This email is already subscribed to our newsletter.',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          error:
            responseData.detail ||
            'Failed to subscribe. Please try again later.',
        }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed to newsletter',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
