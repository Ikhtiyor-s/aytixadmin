module.exports = {
  apps: [
    {
      name: "aytixadmin",
      script: "node_modules/.bin/next",
      args: "start -p 3004",
      cwd: "/var/www/aytixadmin",
      env: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_URL: "https://api.aytix.uz/api/v1",
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      error_file: "/var/www/aytixadmin/logs/error.log",
      out_file: "/var/www/aytixadmin/logs/out.log",
    },
  ],
}
