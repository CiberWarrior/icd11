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

### Apache + Node (PM2)

The app uses **SSR** (`output: 'server'`) with `@astrojs/node`. Apache does not serve the site alone: it **reverse-proxies** all traffic to the Node process. Typical workflow: **`git push`** to GitHub for backup, then **FTP `dist/`** to the server and **`pm2 restart`** — no `git pull` on the server is required for that path. Full instructions (FTP + optional git-on-server): **`DEPLOY_STEP_BY_STEP.md`**. Apache ProxyPass: **`APACHE_PROXYPASS_INSTRUCTIONS.md`**.

#### Prerequisites

- Apache with `proxy`, `proxy_http`, and `headers` enabled (`sudo a2enmod proxy proxy_http headers`)
- Node.js 20.x on the server
- PM2 (recommended): `npm install -g pm2`

#### 1. Build

```bash
npm install
npm run build
```

#### 2. Upload

Copy the built **`dist/`** directory (both `client/` and `server/`) to the server project path (e.g. `/var/www/icd11.biol.pmf.hr/`), overwriting the previous `dist/`. See **`DEPLOY_STEP_BY_STEP.md`** for FTP/SSH paths.

#### 3. Environment

Create a **`.env`** in the **project root on the server** (same folder as `ecosystem.config.cjs`):

```env
MAILCHIMP_API_KEY=your_api_key_here
MAILCHIMP_LIST_ID=your_list_id_here
MAILCHIMP_SERVER=us22
```

Use your real Mailchimp region if not `us22`.

#### 4. Apache: ProxyPass to Node

Proxy **all requests** to the Node app. **`ecosystem.config.cjs`** sets **`PORT: 4322`** — Apache must target **that** port (not 4321; 4321 is the dev server default in `astro.config.mjs`).

HTTP:

```apache
<VirtualHost *:80>
    ServerName icd11.biol.pmf.hr

    ProxyPreserveHost On
    ProxyPass / http://localhost:4322/
    ProxyPassReverse / http://localhost:4322/
</VirtualHost>
```

HTTPS (add inside your existing `*:443` vhost alongside SSL directives):

```apache
<VirtualHost *:443>
    ServerName icd11.biol.pmf.hr
    # ... SSLEngine, certificates, etc.

    ProxyPreserveHost On
    ProxyPass / http://localhost:4322/
    ProxyPassReverse / http://localhost:4322/
</VirtualHost>
```

Then: `sudo apache2ctl configtest` and `sudo systemctl restart apache2`.

Do **not** use `Redirect` to the Node port for HTML — use **ProxyPass** so URLs stay without `:4322`. See **`APACHE_PROXYPASS_INSTRUCTIONS.md`** for troubleshooting.

#### 5. Run with PM2

From the project root on the server:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

Updates after a new build:

```bash
pm2 restart icd11-2027
```

**Port:** Production uses **`process.env.PORT`** from PM2 (`4322` in `ecosystem.config.cjs`). Change it there if the port must differ; no rebuild required.

Manual run (not recommended): `PORT=4322 node dist/server/entry.mjs`

#### Alternative hosting

- **Vercel** (this repo switches to the Vercel adapter when `VERCEL` is set)
- **Netlify**, **Cloudflare Pages**

Set environment variables in the host dashboard for those platforms.
