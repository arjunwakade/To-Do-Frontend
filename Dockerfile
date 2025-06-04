FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --verbose

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