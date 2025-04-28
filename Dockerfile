# Use official Node.js image
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install --only=prod

# Copy the rest of your app
COPY . .

# Expose the port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
