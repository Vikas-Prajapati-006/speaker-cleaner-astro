import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const baseUrl = site ? site.toString().replace(/\/$/, '') : 'https://speaker.thematrixlab.me';

  // Static core routes
  const staticPages = [
    '',
    '/privacy-policy',
    '/terms',
    '/contact',
  ];

  // Dynamic pSEO collection routes
  const devices = await getCollection('devices');

  const brandPages: string[] = [];
  const modelPages: string[] = [];

  devices.forEach((entry) => {
    brandPages.push(`/${entry.data.brandSlug}`);
    entry.data.models.forEach((model) => {
      modelPages.push(`/${entry.data.brandSlug}/${model.slug}`);
    });
  });

  const allUrls = [...staticPages, ...brandPages, ...modelPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (path) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${path === '' ? '1.0' : path.split('/').length > 2 ? '0.8' : '0.6'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`.trim();

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};