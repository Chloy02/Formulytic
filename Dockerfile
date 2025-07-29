FROM node:18-alpine

# Build arguments for environment variables
ARG MONGO_URI
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG JWT_SECRET

# Set working directory
WORKDIR /app

# Copy package files for better Docker layer caching
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --only=production && npm cache clean --force

# Install frontend dependencies (including devDependencies for build)
WORKDIR /app/frontend
RUN npm ci && npm cache clean --force

# Set environment variables for build
ENV MONGO_URI=$MONGO_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV JWT_SECRET=$JWT_SECRET

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Clean up dev dependencies after build to reduce image size
RUN npm prune --production && npm cache clean --force

# Copy backend source
WORKDIR /app
COPY backend/ ./backend/

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

# Change ownership of the app directory
RUN chown -R appuser:nodejs /app
USER appuser

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start backend server
WORKDIR /app
CMD ["npm", "start"]
