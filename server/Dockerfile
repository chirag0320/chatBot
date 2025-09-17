# Stage 1: build
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install all dependencies (dev + prod)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Stage 2: production image
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built files from the build stage
COPY --from=build /app/dist ./dist

# Expose dynamic port (optional)
EXPOSE 5000

# Start the server using the environment PORT
CMD ["node", "dist/index.js"]
