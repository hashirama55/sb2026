#!/bin/bash

# Start FastAPI in the background
echo "Starting FastAPI on port 8000..."
uvicorn api.main:app --host 127.0.0.1 --port 8000 &

# Start Next.js in the background
echo "Starting Next.js on port 3000..."
cd /app/web
PORT=3000 node server.js &

# Update Nginx config with the PORT environment variable if provided by Cloud Run
if [ -n "$PORT" ] && [ "$PORT" != "3000" ]; then
  echo "Updating Nginx to listen on port $PORT..."
  sed -i "s/listen 8080;/listen $PORT;/" /etc/nginx/nginx.conf
fi

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g "daemon off;"
