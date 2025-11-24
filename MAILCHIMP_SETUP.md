# Mailchimp Integration Setup Guide

## Overview

The newsletter form is already integrated with Mailchimp API. You just need to configure your Mailchimp credentials.

## Step-by-Step Setup

### 1. Get Your Mailchimp API Key

1. Log in to your Mailchimp account
2. Go to **Account** → **Extras** → **API keys**
   - Or visit: https://us1.admin.mailchimp.com/account/api/
3. Click **Create A Key**
4. Copy the API key (it will look like: `abc123def456-us1`)

### 2. Get Your List/Audience ID

1. Go to **Audience** → **All contacts**
2. Click **Settings** → **Audience name and defaults**
3. Scroll down to find **Audience ID** (it will look like: `a1b2c3d4e5`)
   - Or check the URL when viewing your audience - the ID is in the URL

### 3. Find Your Server Prefix

The server prefix is usually found in your API key or Mailchimp dashboard URL:
- If your dashboard URL is `us1.admin.mailchimp.com`, your server is `us1`
- If your API key ends with `-us1`, your server is `us1`
- Common servers: `us1`, `us2`, `us3`, `us4`, `us5`, `us6`, `us7`, `us8`, `us9`, `us10`, `us11`, `us12`, `us13`, `us14`, `us15`, `us16`, `us17`, `us18`, `us19`, `us20`, `us21`

### 4. Create `.env` File

In the root directory of your project, create a `.env` file:

```env
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_LIST_ID=your_list_id_here
MAILCHIMP_SERVER=us1
```

**Important:** 
- Replace `your_api_key_here` with your actual API key
- Replace `your_list_id_here` with your actual List/Audience ID
- Replace `us1` with your actual server prefix if different

### 5. Restart Development Server

After creating the `.env` file, restart your development server:

```bash
npm run dev
```

## How It Works

1. **User fills out the form** with:
   - Name (required)
   - Surname (required)
   - Email (required)
   - Newsletter consent checkbox (required)

2. **Form submits to `/api/newsletter`** endpoint

3. **API endpoint**:
   - Validates all fields
   - Sends data to Mailchimp API
   - Adds subscriber to your Mailchimp list
   - Returns success/error message

4. **User sees** success or error message

## Testing

1. Make sure your `.env` file is configured correctly
2. Fill out the form on your website
3. Check your Mailchimp audience to see if the subscriber was added
4. Check browser console for any errors

## Troubleshooting

### "Newsletter service is not configured"
- Make sure `.env` file exists in the root directory
- Check that all three variables are set correctly
- Restart your development server after creating/editing `.env`

### "This email is already subscribed"
- The email address already exists in your Mailchimp list
- This is normal - Mailchimp prevents duplicate subscriptions

### API Errors
- Verify your API key is correct and active
- Check that your List ID is correct
- Ensure your server prefix matches your Mailchimp account region

## Security Notes

- **Never commit `.env` file to Git** - it's already in `.gitignore`
- **Never share your API key** publicly
- When deploying, set environment variables in your hosting platform (Vercel, Netlify, etc.)

## Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Go to your hosting platform's dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the three variables:
   - `MAILCHIMP_API_KEY`
   - `MAILCHIMP_LIST_ID`
   - `MAILCHIMP_SERVER`
4. Redeploy your site

## Form Fields Mapping

The form fields map to Mailchimp merge fields:
- `name` → `FNAME` (First Name)
- `surname` → `LNAME` (Last Name)
- `email` → `email_address`
- `newsletterConsent` → Used for validation (must be checked)

Make sure your Mailchimp list has `FNAME` and `LNAME` merge fields configured (they are usually there by default).

