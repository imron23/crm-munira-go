# ============================================================
# MUNIRA WORLD CRM — Production Dockerfile (MongoDB)
# ============================================================
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy all source files
COPY . .

# Expose the application port
EXPOSE 3000

# Environment defaults (override via docker-compose or .env)
ENV NODE_ENV=production
ENV PORT=3000

# Start server (MongoDB connection is handled inside server/index.js)
CMD ["node", "server/index.js"]
