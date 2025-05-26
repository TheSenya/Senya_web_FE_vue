# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create .env.production file with the correct environment variable
RUN echo "VITE_API_BASE_URL=https://api.senya.ca/api/v1" > .env.production

# Set production environment variables
ENV NODE_ENV=production

# Build the application with production mode
RUN npm run build -- --mode production

# Install curl for health checks
RUN apk add --no-cache curl

# Production stage
FROM nginx:alpine

# Copy the built assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Create custom nginx config
RUN echo 'server { \
    listen 80; \
    server_name _; \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location /api { \
        proxy_pass https://api.senya.ca; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
