- Sample deployment compose file

```yaml
services:
  frontend:
    build:
      context: frontend
      target: production
    restart: always
    ports:
      - "80:80"
    networks:
      - react-express-pribex
    depends_on:
      - backend
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

  backend:
    build:
      context: backend
      target: production
    restart: always
    env_file:
      - ./backend/.env.production
    networks:
      - react-express-pribex
    expose:
      - "3000"
    depends_on:
      - redis
    deploy:
      resources:
        limits:
          cpus: "1.0"
          memory: 1G

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-changeme}
    volumes:
      - redis-data:/data
    networks:
      - react-express-pribex
    deploy:
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

  prometheus:
    image: prom/prometheus:latest
    restart: always
    ports:
      - "9090:9090"
    volumes:
      - ./backend/prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    networks:
      - react-express-pribex
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--storage.tsdb.path=/prometheus"
      - "--storage.tsdb.retention.time=30d"

  grafana:
    image: grafana/grafana:latest
    restart: always
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD:-admin}
      - GF_INSTALL_PLUGINS=
    volumes:
      - grafana-data:/var/lib/grafana
    depends_on:
      - prometheus
    networks:
      - react-express-pribex

networks:
  react-express-pribex:
    name: react-express-pribex
    driver: bridge

volumes:
  redis-data:
    driver: local
  prometheus-data:
    driver: local
  grafana-data:
    driver: local
```

---

- Backend production dockerfile

```yaml
# syntax=docker/dockerfile:1.4

FROM node:lts-bookworm-slim AS production

# Create app directory
WORKDIR /usr/src/app

# Copy dependency files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /usr/src/app

USER nodejs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/healthcheck', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "index.js"]
```

- Frontend Production Dockerfile

```yaml
# syntax=docker/dockerfile:1.4

# Build stage
FROM node:lts-bookworm-slim AS build

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage with Nginx
FROM nginx:alpine AS production

# Copy built static files
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
```
