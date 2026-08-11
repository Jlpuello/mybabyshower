# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

La mayoría de los endpoints administrativos requieren autenticación JWT.

**Header:**
```
Authorization: Bearer <token>
```

## Endpoints

### Público

#### GET /health
Verifica el estado del servidor.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET /event
Obtiene la información pública del evento.

**Response:**
```json
{
  "publicId": "baby-shower-2024",
  "title": "Baby Shower",
  "babyName": "Nuestro bebé",
  "description": "Un momento especial...",
  "eventDate": "2024-12-15",
  "eventTime": "15:00",
  "location": "Salón de Eventos Los Olivos",
  "address": "Av. Principal 123, Ciudad",
  "latitude": 4.6097,
  "longitude": -74.0817,
  "heroImage": "https://...",
  "locationImage": "https://...",
  "storyTitle": "Nuestra historia",
  "storyContent": "Comenzamos este viaje...",
  "revelationTitle": "¡Es una niña!",
  "revelationContent": "Estamos muy felices...",
  "revelationMediaUrl": "https://...",
  "revelationMediaType": "IMAGE",
  "isRevealed": false,
  "primaryColor": "#8B7355",
  "secondaryColor": "#D4C4B7"
}
```

### Invitaciones

#### POST /invitations/validate
Valida un código de invitación y retorna la información del invitado.

**Request Body:**
```json
{
  "code": "BS-7K92"
}
```

**Response (200):**
```json
{
  "publicId": "guest-1",
  "name": "María García",
  "attendanceStatus": "PENDING",
  "event": {
    "publicId": "baby-shower-2024",
    "title": "Baby Shower",
    "babyName": "Nuestro bebé",
    "eventDate": "2024-12-15",
    "eventTime": "15:00",
    "location": "Salón de Eventos Los Olivos",
    "address": "Av. Principal 123, Ciudad"
  },
  "reservedGift": null
}
```

**Response (404):**
```json
{
  "message": "Código de invitación inválido"
}
```

**Response (403):**
```json
{
  "message": "Esta invitación ha sido desactivada"
}
```

**Rate Limiting:** 5 intentos por minuto

#### PATCH /invitations/:guestId/rsvp
Actualiza el estado de asistencia del invitado.

**URL Parameters:**
- `guestId`: ID público del invitado

**Request Body:**
```json
{
  "status": "CONFIRMED"
}
```

**Valores permitidos:** `CONFIRMED`, `DECLINED`

**Response (200):**
```json
{
  "publicId": "guest-1",
  "name": "María García",
  "attendanceStatus": "CONFIRMED"
}
```

### Autenticación (Admin)

#### POST /admin/login
Inicia sesión de administrador.

**Request Body:**
```json
{
  "email": "admin@babyshower.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@babyshower.com",
    "name": "Administrador",
    "event": {
      "publicId": "baby-shower-2024",
      "title": "Baby Shower"
    }
  }
}
```

**Response (401):**
```json
{
  "message": "Credenciales inválidas"
}
```

**Rate Limiting:** 5 intentos por 15 minutos

## Errores

Todos los errores siguen este formato:

```json
{
  "message": "Descripción del error"
}
```

**Códigos de estado HTTP:**
- `400` - Bad Request (validación fallida)
- `401` - Unauthorized (no autenticado)
- `403` - Forbidden (sin permisos)
- `404` - Not Found (recurso no existe)
- `500` - Internal Server Error (error del servidor)

## Rate Limiting

- **General:** 100 requests por 15 minutos
- **Validación de código:** 5 requests por minuto
- **Login:** 5 requests por 15 minutos

Los headers de rate limiting:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Caching

El endpoint `/event` tiene un cache de 5 minutos para optimizar el rendimiento.

## Ejemplos de Uso

### Validar invitación (cURL)
```bash
curl -X POST http://localhost:3000/api/invitations/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "BS-7K92"}'
```

### Login admin (cURL)
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@babyshower.com", "password": "admin123"}'
```

### Obtener evento (JavaScript)
```javascript
const response = await fetch('http://localhost:3000/api/event');
const event = await response.json();
console.log(event);
```

### Actualizar RSVP (JavaScript)
```javascript
const response = await fetch('/api/invitations/guest-1/rsvp', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'CONFIRMED' }),
});
const result = await response.json();
```
