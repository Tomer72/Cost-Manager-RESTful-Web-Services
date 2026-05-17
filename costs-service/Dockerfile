# Dockerfile skeleton.
# Add the service startup steps when implementation begins.

FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3003
CMD ["npm", "start"]

