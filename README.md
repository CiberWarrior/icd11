# 11th International Congress of Dipterology - Website

Modern website for the 11th International Congress of Dipterology, July 10-16, 2027.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the root directory with your Mailchimp credentials:

```env
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_LIST_ID=your_mailchimp_list_id_here
MAILCHIMP_SERVER=us1
```

**How to get Mailchimp credentials:**
- **API Key**: Go to https://us1.admin.mailchimp.com/account/api/ and create an API key
- **List ID**: Go to https://us1.admin.mailchimp.com/lists/, select your audience/list, and find the List ID in the settings
- **Server**: Usually found in your Mailchimp dashboard URL (e.g., `us1`, `us2`, `us3`)

### Development

Start the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:4321`

### Build

Build for production:

```bash
npm run build
```

### Preview

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
/
├── public/
│   ├── images/
│   │   └── logo.jpg          # Conference logo
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── NewsletterForm.astro  # Newsletter subscription form
│   ├── layouts/
│   │   └── Layout.astro      # Base layout component
│   ├── pages/
│   │   ├── index.astro       # Landing page
│   │   └── api/
│   │       └── newsletter.ts # Mailchimp API endpoint
│   └── styles/
│       └── global.css        # Global styles and Tailwind
└── Logo/                     # Original logo assets
```

## 🎨 Features

- **Modern Design**: Cutting-edge design with smooth animations, gradients, and glassmorphism effects
- **Responsive**: Mobile-first responsive design
- **Newsletter Integration**: Mailchimp integration for newsletter subscriptions
- **Performance**: Optimized for fast loading and smooth user experience

## 🔧 Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety
- **Mailchimp API** - Newsletter management

## 📝 Notes

- All content is in English
- The landing page is the foundation for the full website
- Registration and payment features will be added later
- Project structure is designed for easy expansion

## 🚢 Deployment

When ready to deploy, you can use:
- **Vercel** (recommended for Astro)
- **Netlify**
- **Cloudflare Pages**
- Any static hosting service

Make sure to set your environment variables in your hosting platform's dashboard.