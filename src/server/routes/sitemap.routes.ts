import { Router } from 'express';
import { prisma } from '../config/database.ts';
import path from 'path';
import fs from 'fs';

const router = Router();

// ── GET /sitemap.xml ──────────────────────────────────────────
router.get('/sitemap.xml', async (req, res) => {
  try {
    const rawProto = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
    const protocol = rawProto.split(',')[0].trim();
    const rawHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3001';
    const host = rawHost.split(',')[0].trim();
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const baseUrl = (!isLocalhost || !process.env.FRONTEND_URL)
      ? `${protocol}://${host}`
      : process.env.FRONTEND_URL.replace(/\/$/, '');

    const event = await prisma.event.findFirst();
    const lastMod = event?.updatedAt ? new Date(event.updatedAt).toISOString() : new Date().toISOString();

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/guest</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.send(sitemapXml);
  } catch (error) {
    console.error('Error generando sitemap.xml:', error);
    return res.status(500).send('Error generando sitemap');
  }
});

// ── GET /robots.txt ──────────────────────────────────────────
router.get('/robots.txt', (req, res) => {
  const publicRobotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(publicRobotsPath)) {
    return res.sendFile(publicRobotsPath);
  }

  const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3001';
  const baseUrl = (process.env.FRONTEND_URL || `${protocol}://${host}`).replace(/\/$/, '');

  const defaultRobots = `User-agent: *
Allow: /
Allow: /guest
Disallow: /admin
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  return res.send(defaultRobots);
});

export default router;
