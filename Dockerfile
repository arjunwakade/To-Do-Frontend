# Use multi-stage build for better caching
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --verbose

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV CI=false
ENV NODE_ENV=production
ENV GENERATE_SOURCEMAP=false
RUN npm run build --verbose

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]