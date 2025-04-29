# Build stage
FROM node:22-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Edit configuration file
RUN sed -i 's|http://localhost:3000|/api|g' /app/dist/arkham-city-dashboard/browser/assets/json/config.json

# Production stage
FROM nginx:alpine

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/arkham-city-dashboard/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
