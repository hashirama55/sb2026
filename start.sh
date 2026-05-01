#!/bin/bash
set -e

# Fallback to 8080 if PORT is not set
export PORT=${PORT:-8080}
echo "--- STARTUP DIAGNOSTICS ---"
echo "Port: $PORT"
echo "Current Directory: $(pwd)"
echo "Files in /app:"
ls -F /app
echo "Files in /app/web:"
if [ -d "/app/web" ]; then ls -F /app/web; else echo "Directory /app/web NOT FOUND"; fi
echo "---------------------------"

# Remove default nginx config
rm -f /etc/nginx/sites-enabled/default || true

# Start the Backend (FastAPI)
echo "Starting FastAPI on port 8000..."
# Using --proxy-headers and --forwarded-allow-ips for Cloud Run compatibility
PYTHONPATH=/app uvicorn api.main:app --host 127.0.0.1 --port 8000 --proxy-headers --forwarded-allow-ips='*' > /var/log/fastapi.log 2>&1 &

# Start the Frontend (Next.js)
echo "Starting Next.js on port 3000..."
# Check for server.js in common standalone locations
if [ -f "/app/web/server.js" ]; then
    cd /app/web
    HOSTNAME=127.0.0.1 PORT=3000 node server.js > /var/log/nextjs.log 2>&1 &
elif [ -f "/app/web/web/server.js" ]; then
    echo "Found server.js in nested web directory"
    cd /app/web/web
    HOSTNAME=127.0.0.1 PORT=3000 node server.js > /var/log/nextjs.log 2>&1 &
else
    echo "ERROR: Could not find server.js. Searching system-wide..."
    find /app -name "server.js"
    # Attempt to run whatever we found if unique
    FOUND_SERVER=$(find /app -name "server.js" | head -n 1)
    if [ -n "$FOUND_SERVER" ]; then
        echo "Attempting to run found server: $FOUND_SERVER"
        cd $(dirname "$FOUND_SERVER")
        HOSTNAME=127.0.0.1 PORT=3000 node server.js > /var/log/nextjs.log 2>&1 &
    fi
fi

# Wait for services to warm up
echo "Waiting for services to start (10s)..."
sleep 10

# Log Tail for debugging
echo "--- RECENT FASTAPI LOGS ---"
tail -n 20 /var/log/fastapi.log || echo "No FastAPI logs"
echo "--- RECENT NEXTJS LOGS ---"
tail -n 20 /var/log/nextjs.log || echo "No NextJS logs"

# Diagnostic check
echo "Checking connectivity..."
curl -v http://127.0.0.1:8000/ || echo "FastAPI is UNREACHABLE"
curl -v http://127.0.0.1:3000/ || echo "Next.js is UNREACHABLE"

# Update Nginx config
echo "Updating Nginx configuration..."
sed -i "s/listen 8080;/listen $PORT;/" /etc/nginx/nginx.conf

echo "Starting Nginx..."
exec nginx -g "daemon off;"
