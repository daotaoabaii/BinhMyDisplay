# Build stage for frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy frontend files
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY App.tsx ./
COPY index.tsx ./
COPY types.ts ./
COPY components/ ./components/
COPY hooks/ ./hooks/
COPY services/ ./services/
COPY public/ ./public/

# Build frontend - output to public folder
RUN npm run build

# Production stage - Node.js Express Server + Frontend
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy backend files
COPY server.js ./
COPY models/ ./models/

# Copy built frontend from build stage to public folder
COPY --from=frontend-build /app/public ./public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start backend server
CMD ["node", "server.js"]
