// PM2 ecosystem configuration file
// Usage: pm2 start ecosystem.config.cjs
//
// IMPORTANT: Create a .env file in the project root with your Mailchimp credentials:
// MAILCHIMP_API_KEY=your_api_key_here
// MAILCHIMP_LIST_ID=your_list_id_here
// MAILCHIMP_SERVER=us22
//
// PORT is set via environment variable (PM2 will pass it to the Node.js process)
// Astro Node adapter reads PORT from process.env.PORT at runtime

module.exports = {
  apps: [
    {
      name: 'icd11-2027',
      script: './dist/server/entry.mjs',
      instances: 1,
      exec_mode: 'fork',
      // Load environment variables from .env file
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 4322, // Changed from 4321 to avoid port conflict
        // Mailchimp configuration - set these values or use .env file
        // MAILCHIMP_API_KEY: 'your_api_key_here',
        // MAILCHIMP_LIST_ID: 'your_list_id_here',
        // MAILCHIMP_SERVER: 'us1',
      },
      // Auto restart on crash
      autorestart: true,
      // Watch for file changes (disable in production)
      watch: false,
      // Max memory usage before restart
      max_memory_restart: '500M',
      // Log files
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Merge logs
      merge_logs: true,
    },
  ],
};

