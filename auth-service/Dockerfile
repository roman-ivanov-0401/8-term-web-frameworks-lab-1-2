# Build stage
FROM node:22-alpine AS builder
WORKDIR /app

# Copy shared types
COPY shared-types/ ./shared-types/

# Copy service files
COPY auth-service/package*.json ./auth-service/
WORKDIR /app/auth-service
RUN npm ci

COPY auth-service/ .
RUN npm run build

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/auth-service/package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/auth-service/dist ./dist
EXPOSE 3051
CMD ["node", "dist/main"]
