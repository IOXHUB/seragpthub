# Use official Node.js runtime as base image
FROM node:20-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/ ./packages/

# Install dependencies
RUN npm ci --only=production

# Client build stage
FROM base AS client-build
WORKDIR /app
COPY client/ ./client/
RUN npm run build:client

# API build stage  
FROM base AS api-build
WORKDIR /app
COPY api/ ./api/
RUN npm run build:api

# Production stage
FROM node:20-alpine AS production

# Install system dependencies for production
RUN apk add --no-cache \
    cairo \
    jpeg \
    pango \
    musl \
    giflib \
    pixman \
    pangomm \
    libjpeg-turbo \
    freetype

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S librechat -u 1001

# Copy built application
COPY --from=client-build --chown=librechat:nodejs /app/client/dist ./client/dist
COPY --from=api-build --chown=librechat:nodejs /app/api/dist ./api/dist
COPY --from=base --chown=librechat:nodejs /app/node_modules ./node_modules
COPY --chown=librechat:nodejs package*.json ./
COPY --chown=librechat:nodejs api/package*.json ./api/
COPY --chown=librechat:nodejs client/package*.json ./client/

# Create required directories
RUN mkdir -p /app/client/public/images && \
    mkdir -p /app/api/logs && \
    chown -R librechat:nodejs /app

# Switch to non-root user
USER librechat

# Expose port
EXPOSE 3080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node api/dist/healthcheck.js

# Start the application
CMD ["npm", "run", "backend"]
