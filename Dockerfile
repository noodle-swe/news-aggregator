# syntax=docker/dockerfile:1

# ---- 1. Build the static bundle ---------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

# Install dependencies first so this layer is cached between code changes.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ---- 2. Serve it with nginx -------------------------------------------------
FROM nginx:1.29-alpine AS runtime

# Only these variables are substituted into the nginx template; nginx's own
# $variables are left untouched. Empty defaults keep nginx bootable without keys.
ENV NGINX_ENVSUBST_FILTER="^(NEWSAPI_KEY|GUARDIAN_API_KEY|NYT_API_KEY)$" \
    NEWSAPI_KEY="" \
    GUARDIAN_API_KEY="" \
    NYT_API_KEY=""

COPY nginx/proxy-common.conf /etc/nginx/snippets/proxy-common.conf
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
