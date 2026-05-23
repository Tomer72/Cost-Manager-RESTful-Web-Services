# Use the official Node.js 22 Alpine image as the base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies first (leverages Docker layer cache)
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the port the service listens on
EXPOSE 3003

# Start the service
CMD ["npm", "start"]
