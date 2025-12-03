import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Required for API routes to work
  adapter: node({
    mode: 'standalone', // Standalone mode for Apache with Node.js
  }),
  integrations: [tailwind()],
});

