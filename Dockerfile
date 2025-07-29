FROM node:18-alpine

# Build arguments for environment variables
ARG MONGO_URI
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG JWT_SECRET

# Set working directory
WORKDIR /app

# Copy all package files
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies (production only)
WORKDIR /app/backend
RUN npm ci --omit=dev && npm cache clean --force

# Install frontend dependencies (all dependencies for build)
WORKDIR /app/frontend  
RUN npm ci && npm cache clean --force

# Set build environment variables
ENV MONGO_URI=$MONGO_URI
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV JWT_SECRET=$JWT_SECRET

# Copy and build frontend
COPY frontend/ ./
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --omit=dev && npm cache clean --force

# Copy backend source
WORKDIR /app/backend
COPY backend/ ./

# Expose port
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
