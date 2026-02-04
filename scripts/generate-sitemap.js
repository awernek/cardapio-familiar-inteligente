/**
 * Gera sitemap.xml em public/ para indexação (SEO).
 * Rodar antes do build: npm run build (já inclui este script).
 *
 * Base URL: use variável de ambiente BASE_URL ou SITEMAP_BASE_URL,
 * ou padrão https://www.nuri.app.br
 */

import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseUrl = process.env.BASE_URL || process.env.SITEMAP_BASE_URL || 'https://www.nuri.app.br';

const routes = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/como-funciona', priority: '0.8', changefreq: 'monthly' },
  { url: '/para-quem-e', priority: '0.8', changefreq: 'monthly' },
  { url: '/blog', priority: '0.9', changefreq: 'weekly' },
  { url: '/blog/cardapio-semanal-economico', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/planejamento-alimentar-familiar', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/receitas-rapidas-30min', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/economia-mercado', priority: '0.7', changefreq: 'monthly' },
  { url: '/blog/lista-de-compras-inteligente', priority: '0.7', changefreq: 'monthly' },
  { url: '/receitas', priority: '0.8', changefreq: 'weekly' },
  { url: '/apoie', priority: '0.5', changefreq: 'monthly' },
];

const lastmod = new Date().toISOString().split('T')[0];

const urlset = routes
  .map(
    (r) => `  <url>
    <loc>${baseUrl}${r.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
writeFileSync(outPath, sitemap, 'utf8');
console.log('sitemap.xml gerado em public/sitemap.xml (base:', baseUrl, ')');
