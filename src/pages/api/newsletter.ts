import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { firstName, lastName, email, newsletterConsent } = data;

    // Validation
    if (!firstName || !lastName || !email || !newsletterConsent) {
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
        FNAME: firstName,
        LNAME: lastName,
      },
    };

    // Add to Mailchimp
    const response = await fetch(mailchimpUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mailchimpData),
    });

    const responseData = await response.json();

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
