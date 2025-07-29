# STAGE 1: Install backend dependencies
FROM node:18-alpine AS backend-deps
WORKDIR /app
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# STAGE 2: Install frontend dependencies
FROM node:18-alpine AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
# Install all dependencies, including devDependencies needed for the build
RUN npm ci

# STAGE 3: Build the frontend application
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
# Copy dependencies from the previous stage
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
# Copy the rest of the frontend source code
COPY frontend/ ./
# Set build-time environment variables passed from Railway
ARG MONGO_URI
ARG JWT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ENV MONGO_URI=$MONGO_URI
ENV JWT_SECRET=$JWT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
# Run the build script
RUN npm run build

# STAGE 4: Create the final production image
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy backend code and production dependencies from the first stage
COPY --from=backend-deps /app/node_modules ./backend/node_modules
COPY backend/ ./backend

# Copy the built frontend assets from the builder stage
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Copy the root package.json to use its "start" script
COPY package.json .

# Create a non-root user for better security
RUN addgroup -S appuser && adduser -S appuser -G appuser
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port the server will run on
EXPOSE 5000

# The command to start the application
CMD ["npm", "start"]