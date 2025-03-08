# Build
FROM node:alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Run
EXPOSE 3000
CMD ["node", "dist/src/main"]
