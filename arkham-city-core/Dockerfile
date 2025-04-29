FROM node:22-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

COPY .env.example .env

# Build the application
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]