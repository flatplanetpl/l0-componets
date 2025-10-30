# Dockerfile for EduPlatform demo
FROM node:18-bullseye-slim

WORKDIR /app

# Copy package files
COPY demo/package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY demo ./

# Copy shared frontend components
COPY frontend/src /frontend/src

# Link node_modules for shared components resolution
RUN ln -s /app/node_modules /frontend/node_modules

# Copy .env as both .env.production and .env.local for Next.js
COPY demo/.env .env.production
COPY demo/.env .env.local

# Expose port
EXPOSE 3000

# Build the application
RUN npm run build

# Start the application
CMD ["npm", "start"]
