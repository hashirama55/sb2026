#!/bin/bash
set -e

# Fallback to 8080 if PORT is not set
export PORT=${PORT:-8080}
echo "Starting Scam Guard services on port $PORT..."

# Start the Backend (FastAPI)
echo "Starting FastAPI on port 8000..."
# Use absolute path and ensure it runs in the background
PYTHONPATH=/app uvicorn api.main:app --host 127.0.0.1 --port 8000 &

# Start the Frontend (Next.js)
echo "Starting Next.js on port 3000..."
cd /app/web
# Next.js standalone expects its own PORT env var and HOSTNAME
HOSTNAME=127.0.0.1 PORT=3000 node server.js &

# Wait a moment for background services to initialize
sleep 2

# Update Nginx config with the correct port from Cloud Run
echo "Updating Nginx configuration to listen on port $PORT..."
sed -i "s/listen 8080;/listen $PORT;/" /etc/nginx/nginx.conf

# Start Nginx in the foreground
echo "Starting Nginx..."
exec nginx -g "daemon off;"
