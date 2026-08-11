# Deployment Guide

## Prerequisites

- Docker and Docker Compose installed
- PostgreSQL database
- Environment variables configured

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mybabyshower"

# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL="https://yourdomain.com"

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="24h"
```

## Docker Deployment

### Build the image

```bash
docker build -t mybabyshower .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Run with Docker

```bash
docker run -d \
  --name mybabyshower \
  -p 3000:3000 \
  --env-file .env \
  mybabyshower
```

## Database Setup

### Generate Prisma Client

```bash
docker exec -it mybabyshower npx prisma generate
```

### Push schema to database

```bash
docker exec -it mybabyshower npx prisma db push
```

### Seed database

```bash
docker exec -it mybabyshower npm run db:seed
```

## CI/CD with GitHub Actions

The project includes a GitHub Actions workflow for automatic deployment:

1. Push to `main` branch triggers the workflow
2. Tests run automatically
3. Docker image is built and pushed to Docker Hub
4. Application is deployed to the server

Required secrets in GitHub:
- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password/token
- `SERVER_HOST`: Server hostname/IP
- `SERVER_USER`: SSH username
- `SSH_PRIVATE_KEY`: SSH private key for server access

## Health Check

Check if the application is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Troubleshooting

### View logs

```bash
docker logs mybabyshower
```

### Restart container

```bash
docker restart mybabyshower
```

### Access database

```bash
docker exec -it mybabyshower npx prisma studio
```
