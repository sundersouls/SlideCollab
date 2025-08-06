# Frontend Dockerfile - serves built React app with Node.js serve
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY public ./public
COPY src ./src
COPY tsconfig.json ./

# Set build-time environment variable
ARG REACT_APP_SERVER_URL=http://localhost:5000
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL

# Build the app
RUN npm run build

# Production stage - serve with Node.js
FROM node:18-alpine

WORKDIR /app

# Install serve globally to serve the built React app
RUN npm install -g serve

# Copy built React app from builder stage
COPY --from=builder /app/build ./build

# Expose port 3000
EXPOSE 3000

# Serve the built app on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]