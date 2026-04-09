FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/build-config/package.json packages/build-config/
COPY packages/shared/package.json packages/shared/
COPY services/host/package.json services/host/
COPY services/catalog/package.json services/catalog/
COPY services/matches/package.json services/matches/
RUN npm ci

COPY . .

RUN npm run build --workspace=services/matches

FROM nginx:alpine
COPY services/matches/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/services/matches/dist /usr/share/nginx/html
EXPOSE 80
