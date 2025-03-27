# Build
FROM node:alpine as builder
WORKDIR /app

ARG ENV_CONFIG=production

COPY package*.json ./
RUN npm install
COPY . .
RUN ng build --configuration=${ENV_CONFIG}

# Deploy
FROM nginx:latest
EXPOSE 80

COPY --from=builder /app/dist/client/browser /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

