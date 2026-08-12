# Build stage for frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci
COPY src/client ./src/client
COPY src/shared ./src/shared
COPY public ./public
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./
RUN npm run build:client

# Build stage for backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY package*.json ./
RUN npm ci
COPY src/server ./src/server
COPY src/shared ./src/shared
COPY tsconfig*.json ./
COPY prisma ./prisma
RUN npx prisma generate
RUN npm run build:server

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=backend-builder /app/backend/dist ./dist
COPY --from=backend-builder /app/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=frontend-builder /app/frontend/dist ./public
COPY prisma ./prisma
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/server.js"]
