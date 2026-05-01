#!/bin/bash
set -e

# Fallback to 8080 if PORT is not set
export PORT=${PORT:-8080}
echo "Starting Scam Guard services on port $PORT..."

# Remove default nginx config that might conflict on port 80
rm -f /etc/nginx/sites-enabled/default || true

# Start the Backend (FastAPI)
echo "Starting FastAPI on port 8000..."
PYTHONPATH=/app uvicorn api.main:app --host 127.0.0.1 --port 8000 --proxy-headers > /var/log/fastapi.log 2>&1 &

# Start the Frontend (Next.js)
echo "Starting Next.js on port 3000..."
if [ -d "/app/web" ]; then
    cd /app/web
    # Diagnostic: check if server.js exists
    if [ ! -f "server.js" ]; then
        echo "WARNING: server.js not found in /app/web. Searching..."
        find /app -name server.js
    fi
    HOSTNAME=127.0.0.1 PORT=3000 node server.js > /var/log/nextjs.log 2>&1 &
else
    echo "ERROR: /app/web directory not found!"
    ls -la /app
fi

# Wait a moment for background services to initialize
echo "Waiting for services to start..."
sleep 5

# Diagnostic: check if services are listening
echo "Checking internal services..."
curl -s http://127.0.0.1:8000/ > /dev/null && echo "FastAPI is UP" || echo "FastAPI is DOWN"
curl -s http://127.0.0.1:3000/ > /dev/null && echo "Next.js is UP" || echo "Next.js is DOWN"

# Update Nginx config with the correct port from Cloud Run
echo "Updating Nginx configuration to listen on port $PORT..."
sed -i "s/listen 8080;/listen $PORT;/" /etc/nginx/nginx.conf

# Start Nginx in the foreground
echo "Starting Nginx..."
exec nginx -g "daemon off;"
