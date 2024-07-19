# Use the latest stable version of Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -g npm@latest && npm install

# Copy the rest of the application files
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Add a health check to monitor the container's health
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1

# Clean up unnecessary files to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# Set the entry point and command to start the application
CMD ["npm", "start"]

# Comments to explain each major section of the Dockerfile
# - Base image: Use the latest stable version of Node.js
# - Working directory: Set the working directory to /app
# - Copy package files: Copy package.json and package-lock.json
# - Install dependencies: Install npm and project dependencies
# - Copy application files: Copy the rest of the application files
# - Environment variables: Set necessary environment variables
# - Expose port: Expose the port the app runs on
# - Health check: Add a health check to monitor the container's health
# - Clean up: Remove unnecessary files to reduce image size
# - Entry point: Set the entry point and command to start the application