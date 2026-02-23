FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy all files (including media files)
COPY . .

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
