/**
 * PM2 Ecosystem Configuration
 * Run: pm2 start ecosystem.config.js
 */

module.exports = {
  apps: [
    // Backend Server
    {
      name: 'backend',
      script: './server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: ['server.js', 'models/'],
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '500M',
      error_file: 'logs/backend-error.log',
      out_file: 'logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s'
    },
    // Frontend Server (Preview)
    {
      name: 'frontend',
      script: 'npm',
      args: 'run preview',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      error_file: 'logs/frontend-error.log',
      out_file: 'logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],

  /**
   * Deployment Configuration
   * pm2 deploy ecosystem.config.js production setup
   * pm2 deploy ecosystem.config.js production update
   * pm2 deploy ecosystem.config.js production exec "npm run build"
   */
  deploy: {
    production: {
      user: 'node',
      host: 'your-production-server.com',
      ref: 'origin/main',
      repo: 'https://github.com/yourusername/your-repo.git',
      path: '/var/www/app',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
    },
    staging: {
      user: 'node',
      host: 'your-staging-server.com',
      ref: 'origin/develop',
      repo: 'https://github.com/yourusername/your-repo.git',
      path: '/var/www/staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js'
    }
  }
};
