# Stage 1: Build the client application
FROM node:18-alpine AS client-build

# Set the working directory for the client build
WORKDIR /client

# Copy package.json and package-lock.json for client
COPY client/package*.json ./

# Install client dependencies
RUN npm install

# Copy the client source code and build
COPY client ./
RUN npm run build

# Stage 2: Build the server application
FROM node:18-alpine AS server-build

# Set the working directory for the server build
WORKDIR /server

# Copy package.json and package-lock.json for server
COPY server/package*.json ./

# Install server dependencies
RUN npm install

# Copy the server source code and build
COPY server ./
RUN npm run build

# Stage 3: Create the final image
FROM node:18-alpine

# Set the working directory for the final image
WORKDIR /

# Copy the built client assets and server code from previous stages
COPY --from=client-build /client/dist /client/dist
COPY --from=server-build /server/dist /server/dist

# Copy only the necessary files for the server
COPY --from=server-build /server/package*.json ./

# Install only production dependencies for the server
RUN npm install --only=production

# Expose the port
EXPOSE 8080

# Command to run the server
CMD ["node", "/server/dist/index.js"]
