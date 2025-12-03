// PM2 ecosystem configuration file
// Usage: pm2 start ecosystem.config.cjs

module.exports = {
  apps: [
    {
      name: 'icd11-2027',
      script: './dist/server/entry.mjs',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 4321,
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

