import type { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { prisma } from '../config/database.ts';
import { getCache, setCache } from './cache.middleware.ts';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const seoMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Ignorar peticiones que no sean GET
  if (req.method !== 'GET') {
    return next();
  }

  // Ignorar rutas conocidas de API, uploads, health check, sitemap y robots
  const pathName = req.path;
  if (
    pathName.startsWith('/api') ||
    pathName.startsWith('/uploads') ||
    pathName === '/health' ||
    pathName === '/sitemap.xml' ||
    pathName === '/robots.txt'
  ) {
    return next();
  }

  // Ignorar archivos estáticos con extensiones (.js, .css, .png, .jpg, .ico, etc.)
  if (/\.[a-zA-Z0-9]+$/.test(pathName)) {
    return next();
  }

  try {
    // Buscar index.html (en dist para producción o en src/client para desarrollo)
    const distIndexPath = path.join(process.cwd(), 'dist', 'index.html');
    const clientIndexPath = path.join(process.cwd(), 'src', 'client', 'index.html');
    const publicIndexPath = path.join(process.cwd(), 'public', 'index.html');

    let indexPath = '';
    if (fs.existsSync(distIndexPath)) {
      indexPath = distIndexPath;
    } else if (fs.existsSync(clientIndexPath)) {
      indexPath = clientIndexPath;
    } else if (fs.existsSync(publicIndexPath)) {
      indexPath = publicIndexPath;
    } else {
      return next();
    }

    let html = fs.readFileSync(indexPath, 'utf-8');

    // Obtener datos del evento desde caché o base de datos
    const cacheKey = 'event:public';
    let event: any = getCache(cacheKey);
    if (!event) {
      event = await prisma.event.findFirst();
      if (event) {
        setCache(cacheKey, event, 300);
      }
    }

    // Determinar URL base para enlaces absolutos (Open Graph requiere URLs absolutas accesibles públicamente)
    const rawProto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
    const protocol = rawProto.split(',')[0].trim();
    const rawHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3001';
    const host = rawHost.split(',')[0].trim();

    // Si la petición viene por un dominio público / túnel (e.g. cloudflare tunnel), usar el host entrante
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const baseUrl = (!isLocalhost || !process.env.FRONTEND_URL)
      ? `${protocol}://${host}`
      : process.env.FRONTEND_URL.replace(/\/$/, '');

    const currentUrl = `${baseUrl}${pathName}`;

    // Valores por defecto
    const babyName = event?.babyName || 'Nuestro Bebé';
    const title = event?.metaTitle || event?.title || `Baby Shower de ${babyName}`;
    const defaultDesc = `¡Estás invitado a celebrar el Baby Shower de ${babyName}! Revisa la fecha, ubicación y confirma tu asistencia.`;
    const description = event?.metaDescription || event?.description || defaultDesc;

    let imagePath = event?.ogImage || event?.heroImage || '/og-image.jpg';
    let imageUrl = imagePath.startsWith('http')
      ? imagePath
      : `${baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;

    const isAdminRoute = pathName.startsWith('/admin');
    const robotsTag = isAdminRoute
      ? '<meta name="robots" content="noindex, nofollow" />'
      : '<meta name="robots" content="index, follow, max-image-preview:large" />';

    // Construcción del esquema estructurado Schema.org Event (JSON-LD)
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': title,
      'description': description,
      'startDate': event?.eventDate ? new Date(event.eventDate).toISOString() : undefined,
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
      'location': {
        '@type': 'Place',
        'name': event?.location || 'Lugar del Evento',
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': event?.address || '',
        },
      },
      'image': [imageUrl],
      'organizer': {
        '@type': 'Person',
        'name': babyName,
      },
    };

    const seoTags = `
  <!-- SEO General Dynamic Tags -->
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(currentUrl)}" />
  ${robotsTag}

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${escapeHtml(currentUrl)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(imageUrl)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="${escapeHtml(title)}" />
  <meta property="og:locale" content="es_ES" />

  <!-- Twitter Cards -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${escapeHtml(currentUrl)}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>`;

    // Reemplazar la etiqueta <title> preexistente con nuestro bloque de tags completos
    if (html.includes('<title>')) {
      html = html.replace(/<title>[\s\S]*?<\/title>/i, seoTags);
    } else {
      html = html.replace('</head>', `${seoTags}\n</head>`);
    }

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return res.send(html);
  } catch (error) {
    console.error('Error al inyectar SEO meta tags:', error);
    return next();
  }
};
