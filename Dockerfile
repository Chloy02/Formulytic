# 1. Install dependencies for backend
FROM node:18-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev

# 2. Install dependencies for frontend
FROM node:18-alpine AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# 3. Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
COPY frontend/ ./

# Set build-time environment variables for Next.js build
ARG MONGO_URI
ARG JWT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ENV MONGO_URI=$MONGO_URI
ENV JWT_SECRET=$JWT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

RUN npm run build

# 4. Final production image
FROM node:18-alpine AS final
WORKDIR /app
ENV NODE_ENV=production

# Copy backend code and dependencies
COPY --from=backend-deps /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Expose port and start server
EXPOSE 5000
CMD ["npm", "start", "--prefix", "backend"]


