# Base image with only the necessary runtime, using Alpine Linux for small size
FROM node:18-alpine AS base

# Set the working directory in the container
WORKDIR /app

# Install necessary build tools
RUN apk add --no-cache --virtual .gyp python3 make g++ 

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS build

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy all files
COPY . .

# Build the TypeScript code
RUN npm run build

# Final image, copying only the built files and production dependencies
FROM node:18-alpine AS release

WORKDIR /app

# Copy package.json and package-lock.json again for the final stage
COPY --from=build /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the dist folder from the build stage
COPY --from=build /app/dist ./dist

# Expose the application port
EXPOSE 8080

# Command to run the application
CMD ["node", "dist/index.js"]
