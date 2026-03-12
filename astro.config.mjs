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
    port: 4321,
    host: true,
  },
  integrations: [tailwind()],
});

