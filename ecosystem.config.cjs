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

function isExampleValue(value) {
  if (!value) return true;
  const lower = String(value).trim().toLowerCase();
  return (
    lower.includes('your_') ||
    lower.includes('changeme') ||
    lower.includes('placeholder') ||
    lower.endsWith('_here')
  );
}

const mailchimpProblems = [];
if (isExampleValue(fileEnv.MAILCHIMP_API_KEY)) {
  mailchimpProblems.push('MAILCHIMP_API_KEY is missing or still the example text');
}
if (isExampleValue(fileEnv.MAILCHIMP_LIST_ID)) {
  mailchimpProblems.push('MAILCHIMP_LIST_ID is missing or still the example text');
}
if (!fileEnv.MAILCHIMP_SERVER) {
  mailchimpProblems.push('MAILCHIMP_SERVER is missing');
}
const apiKey = fileEnv.MAILCHIMP_API_KEY || '';
if (apiKey.includes('-')) {
  const suffix = apiKey.slice(apiKey.lastIndexOf('-') + 1);
  if (fileEnv.MAILCHIMP_SERVER && suffix !== fileEnv.MAILCHIMP_SERVER) {
    mailchimpProblems.push(
      'MAILCHIMP_SERVER does not match the suffix at the end of the API key',
    );
  }
} else if (apiKey && !isExampleValue(apiKey)) {
  mailchimpProblems.push('MAILCHIMP_API_KEY has no datacenter suffix (for example -us22)');
}
if (mailchimpProblems.length > 0) {
  console.error('[icd11] Newsletter will fail until .env on this server is fixed.');
  for (const problem of mailchimpProblems) {
    console.error('[icd11]', problem);
  }
  console.error('[icd11] Edit .env here. Do not upload .env from the Mac.');
}

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
