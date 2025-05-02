# Build
FROM node:23.11.0-alpine3.21 as builder
WORKDIR /app

ARG ENV_CONFIG=production

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=${ENV_CONFIG}

# Deploy
FROM nginx:1.27.5-alpine3.21
EXPOSE 80

COPY --from=builder /app/dist/client/browser /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

