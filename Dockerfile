# ============================================
# Stage 1: Build
# ============================================
FROM node:20-alpine AS build

WORKDIR /app
COPY .env.production ./

# Copy root package files
COPY package.json ./

# Copy client and server package files
COPY client/package.json client/package-lock.json* ./client/
COPY server/package.json server/package-lock.json* ./server/

# Install dependencies
RUN cd client && npm install
RUN cd server && npm install

# Copy all source code
COPY client/ ./client/
COPY server/ ./server/
RUN ls -la
RUN cat .env.production || echo "NO_ENV_PRODUCTION"

# Build client (Vite)
RUN cd client && npm run build

# Build server (TypeScript)
RUN cd server && npm run build

# ============================================
# Stage 2: Production
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Copy server build output and dependencies
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/server/node_modules ./server/node_modules
COPY --from=build /app/server/package.json ./server/package.json

# Copy client build output (served as static files by Express)
COPY --from=build /app/client/dist ./client/dist

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE ${PORT}

CMD ["node", "server/dist/index.js"]
