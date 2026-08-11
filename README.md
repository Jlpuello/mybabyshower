# Baby Shower Platform

Plataforma web de Baby Shower con invitación digital, mesa de regalos y galería de recuerdos.

## Stack Tecnológico

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Base de datos**: PostgreSQL, Prisma ORM
- **Infraestructura**: Docker, Docker Compose

## Estructura del Proyecto

```
baby-shower/
├── src/
│   ├── client/          # Frontend React
│   ├── server/          # Backend Express
│   └── shared/          # Tipos y constantes compartidos
├── prisma/              # Schema y seed
├── public/              # Assets estáticos
└── uploads/             # Imágenes subidas
```

## Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones.

### 3. Iniciar PostgreSQL con Docker

```bash
docker compose up -d
```

### 4. Generar Prisma Client y migrar base de datos

```bash
npm run db:generate
npm run db:push
```

### 5. Sembrar datos iniciales (opcional)

```bash
npm run db:seed
```

## Scripts Disponibles

```bash
npm run dev              # Iniciar frontend y backend en desarrollo
npm run dev:client       # Solo frontend
npm run dev:server       # Solo backend
npm run build            # Build para producción
npm run db:studio        # Abrir Prisma Studio
npm run db:migrate       # Crear nueva migración
npm run db:push          # Sincronizar schema con DB
```

## Códigos de Invitación de Prueba

- `BS-7K92` - María García
- `BS-3M45` - Carlos López
- `BS-9N81` - Ana Martínez

## Admin de Prueba

- Email: `admin@babyshower.com`
- Password: `admin123`

## Desarrollo

El servidor backend corre en `http://localhost:3000`
El frontend corre en `http://localhost:5173`

Vite está configurado con proxy para redirigir `/api` al backend.

