# Stage 1: build
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy source code and env
COPY . .

# Use .env.development explicitly
ENV VITE_API_URL=http://localhost:3001/api
RUN npm run build

RUN echo "VITE_API_URL=$VITE_API_URL"

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
