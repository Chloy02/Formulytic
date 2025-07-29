# ---- Base ----
FROM node:18-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS dependencies
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm ci --omit=dev

COPY frontend/package.json frontend/package-lock.json* ./frontend/
RUN cd frontend && npm ci

# ---- Frontend Build ----
FROM base AS frontend-builder
COPY --from=dependencies /app/frontend/node_modules ./frontend/node_modules
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production

# Copy production backend dependencies
COPY --from=dependencies /app/backend/node_modules ./backend/node_modules
COPY backend/ ./backend/

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Expose port and start server
EXPOSE 5000
CMD ["npm", "start", "--prefix", "backend"]

