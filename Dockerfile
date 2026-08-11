# Build stage for frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci
COPY src/client ./src/client
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
COPY index.html ./
RUN npm run build:client

# Build stage for backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY package*.json ./
RUN npm ci
COPY src/server ./src/server
COPY tsconfig.json ./
COPY tsconfig.server.json ./
COPY prisma ./prisma
RUN npm run build:server
RUN npx prisma generate

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=frontend-builder /app/frontend/dist ./public
COPY prisma ./prisma
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
