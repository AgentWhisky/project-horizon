# Use Node.js as base image
FROM node:18

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Expose port for Heroku
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main"]
