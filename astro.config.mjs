import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Required for API routes to work
  adapter: node({
    mode: 'standalone',
  }),
  // Port configuration: Astro Node adapter reads process.env.PORT at runtime
  // Default port 4321 is only used if PORT env var is not set
  // Set PORT in ecosystem.config.cjs or via environment variable
  // host: true allows binding to both IPv4 and IPv6 (needed for Apache ProxyPass)
  server: {
    port: 4321, // Default fallback - actual port comes from process.env.PORT at runtime
    host: true, // Changed from false to true to listen on both IPv4 and IPv6
  },
  integrations: [tailwind()],
});

