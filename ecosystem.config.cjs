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

const fs = require('fs');
const path = require('path');

// Some PM2 versions ignore env_file. Load .env ourselves so Mailchimp
// credentials always reach the Node process at runtime.
function loadEnvFile(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) {
    return env;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }
    const eq = line.indexOf('=');
    if (eq <= 0) {
      continue;
    }
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const dotenvPath = path.join(__dirname, '.env');
const fileEnv = loadEnvFile(dotenvPath);

module.exports = {
  apps: [
    {
      name: 'icd11-2027',
      script: './dist/server/entry.mjs',
      instances: 1,
      exec_mode: 'fork',
      // Kept for newer PM2; fileEnv below is the reliable path
      env_file: '.env',
      env: {
        NODE_ENV: 'production',
        PORT: 4322,
        ...fileEnv,
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
