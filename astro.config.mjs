import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

const isVercel = !!process.env.VERCEL;

let adapter;
if (isVercel) {
  const mod = await import('@astrojs/vercel/serverless');
  adapter = mod.default();
} else {
  adapter = node({ mode: 'standalone' });
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter,
  server: {
    // Port 4321 is fallback for dev mode (npm run dev)
    // Production uses process.env.PORT (set to 4322 by PM2 via ecosystem.config.cjs)
    port: 4321,
    host: true, // Listen on both IPv4 and IPv6 (needed for Apache ProxyPass)
  },
  integrations: [tailwind()],
});

