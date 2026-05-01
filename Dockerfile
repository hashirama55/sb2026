# Stage 1: Build Next.js
FROM node:20-slim AS web-build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY web/package.json web/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY web/ ./
ENV NODE_ENV production
# Set NEXT_PUBLIC_API_URL to /api for relative path routing via Nginx
ENV NEXT_PUBLIC_API_URL=/api
RUN pnpm run build

# Stage 2: Final Image
FROM python:3.11-slim

# Allow statements and log messages to immediately appear in the logs
ENV PYTHONUNBUFFERED 1
ENV NODE_ENV production

# Install Node.js and Nginx
RUN apt-get update && apt-get install -y \
    curl \
    nginx \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy API and shared code
COPY . ./

# Install API dependencies
RUN pip install --no-cache-dir -r api/requirements.txt

# Copy Next.js standalone build
# We place it in /app/web so start.sh can find it
WORKDIR /app/web
COPY --from=web-build /app/.next/standalone ./
COPY --from=web-build /app/public ./public
COPY --from=web-build /app/.next/static ./.next/static

# Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Startup script
WORKDIR /app
COPY start.sh ./
RUN chmod +x start.sh && \
    mkdir -p /var/log && \
    touch /var/log/fastapi.log /var/log/nextjs.log && \
    chmod 666 /var/log/fastapi.log /var/log/nextjs.log

# Cloud Run sets the PORT environment variable. Nginx will listen on this port.
EXPOSE 8080

ENV PYTHONPATH="${PYTHONPATH}:/app"

CMD ["./start.sh"]
