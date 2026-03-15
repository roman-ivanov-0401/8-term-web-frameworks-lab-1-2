FROM node:22-alpine AS builder
WORKDIR /app
COPY front-app/package*.json ./
RUN npm ci
COPY front-app/ .
RUN npm run build:nots

FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
