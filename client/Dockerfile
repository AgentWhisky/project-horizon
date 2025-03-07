# Use Node.js for building the app
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build --prod

# Use Nginx for serving Angular
FROM nginx:alpine
COPY --from=build /app/dist/client /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
