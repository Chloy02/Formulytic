FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy backend package files first
COPY backend/package*.json ./backend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm ci --production && npm cache clean --force

# Copy backend source
COPY backend/ ./

# Copy frontend package files
WORKDIR /app
COPY frontend/package*.json ./frontend/

# Install frontend dependencies (all deps for build)
WORKDIR /app/frontend
RUN npm ci && npm cache clean --force

# Copy frontend source and build
COPY frontend/ ./

# Build frontend with environment variables available at runtime
ENV NODE_ENV=production
RUN npm run build

# Remove frontend dev dependencies to reduce image size
RUN npm prune --production && npm cache clean --force

# Switch back to backend directory
WORKDIR /app/backend

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

# Change ownership
RUN chown -R appuser:nodejs /app
USER appuser

# Expose port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]
