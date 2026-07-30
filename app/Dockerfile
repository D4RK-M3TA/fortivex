# FortiVex Site — production image (multi-stage)
# Stage 1: build the Vite app
FROM node:20-slim AS builder

WORKDIR /app

# Install deps (cacheable layer)
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm install --frozen-lockfile; \
  elif [ -f yarn.lock ]; then corepack enable yarn && yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; fi

# Build
COPY . .
RUN npm run build

# Stage 2: serve with nginx (runs as nginx user, port 8080)
FROM nginx:alpine

# SPA: serve index.html for all routes; listen 8080 (non-root friendly)
RUN echo 'server { \
  listen 8080; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
  location /health { default_type text/plain; return 200 "ok"; } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
