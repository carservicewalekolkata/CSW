#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const XML_NAMESPACES = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';

const DEFAULT_CONFIG = {
  baseUrl: 'https://carservicewale.com',
  backendUrl: 'https://control.carservicewale.com/api',
  outputDir: 'public',
  staticRoutes: [
    '/',
    '/services',
    '/about',
    '/contact',
    '/bookings',
    '/cart',
    '/job-card',
    '/login',
    '/order-estimate',
    '/order-summary',
    '/profile',
    '/schedule-pickup',
    '/signup',
    '/vehicles',
    '/wallet'
  ]
};

const ensureTrailingSlash = (value) => (value.endsWith('/') ? value : `${value}/`);
const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const selectConfig = () => ({
  baseUrl: trimTrailingSlash(process.env.SITEMAP_BASE_URL ?? DEFAULT_CONFIG.baseUrl),
  backendUrl: trimTrailingSlash(process.env.SITEMAP_BACKEND_URL ?? DEFAULT_CONFIG.backendUrl),
  outputDir: process.env.SITEMAP_OUTPUT_DIR ?? DEFAULT_CONFIG.outputDir,
  staticRoutes:
    process.env.SITEMAP_STATIC_ROUTES?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? DEFAULT_CONFIG.staticRoutes
});

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed for ${url}: ${response.status} ${response.statusText} ${text}`);
  }
  return response.json();
};

const fetchVehicleSitemapEntries = async (backendUrl) => {
  const params = new URLSearchParams({
    includeInactive: 'false',
    limit: '5000'
  });

  const response = await fetchJson(`${ensureTrailingSlash(backendUrl)}v1/seo/sitemaps?${params.toString()}`);

  if (!response?.success) {
    throw new Error(response?.message ?? 'Unable to fetch vehicle sitemap entries.');
  }

  return response.data ?? [];
};

const formatDate = (value, fallback) => {
  if (!value) {
    return fallback;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback;
  }
  return parsed.toISOString().split('T')[0];
};

const buildUrlEntry = ({ loc, lastmod, changefreq = 'weekly', priority = '0.7' }) =>
  `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const buildUrlSet = (entries) => {
  const urls = entries.map(buildUrlEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${XML_NAMESPACES}>
${urls}
</urlset>
`;
};

const buildSitemapIndexEntry = ({ loc, lastmod }) =>
  `  <sitemap>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`;

const buildSitemapIndex = (entries) => {
  const sitemapEntries = entries.map(buildSitemapIndexEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex ${XML_NAMESPACES}>
${sitemapEntries}
</sitemapindex>
`;
};

const ensureLeadingSlash = (value) => (value.startsWith('/') ? value : `/${value}`);

const toAbsoluteUrl = (baseUrl, route) => {
  const normalizedBase = trimTrailingSlash(baseUrl);
  if (route === '/') {
    return `${normalizedBase}/`;
  }
  return `${normalizedBase}${ensureLeadingSlash(route)}`;
};

const collectStaticEntries = (routes, baseUrl, generatedOn) =>
  Array.from(new Set(routes))
    .sort()
    .map((route) => ({
      loc: toAbsoluteUrl(baseUrl, route),
      lastmod: generatedOn,
      changefreq: 'weekly',
      priority: route === '/' ? '1.0' : '0.8'
    }));

const collectServiceEntries = (entries, baseUrl, generatedOn) =>
  (entries ?? [])
    .filter((entry) => entry && typeof entry.path === 'string' && entry.path.trim().length > 0)
    .map((entry) => ({
      loc: toAbsoluteUrl(baseUrl, entry.path),
      lastmod: formatDate(entry.last_modified, generatedOn),
      changefreq: 'weekly',
      priority: '0.7'
    }))
    .sort((a, b) => a.loc.localeCompare(b.loc));

const writeFileSafe = async (filePath, contents) => {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, contents, 'utf8');
};

const main = async () => {
  const config = selectConfig();
  const generatedOn = new Date().toISOString().split('T')[0];

  const scriptDir = fileURLToPath(new URL('.', import.meta.url));
  const projectRoot = path.join(scriptDir, '..', '..');
  const outputDir = path.join(projectRoot, config.outputDir);
  const sitemapDir = path.join(outputDir, 'sitemaps');

  const vehicleEntries = await fetchVehicleSitemapEntries(config.backendUrl);

  const staticEntries = collectStaticEntries(config.staticRoutes, config.baseUrl, generatedOn);
  const serviceEntries = collectServiceEntries(vehicleEntries, config.baseUrl, generatedOn);

  const staticSitemapPath = path.join(sitemapDir, 'sitemap-static.xml');
  const serviceSitemapPath = path.join(sitemapDir, 'sitemap-services.xml');
  const indexSitemapPath = path.join(outputDir, 'sitemap.xml');

  const staticSitemapXml = buildUrlSet(staticEntries);
  const serviceSitemapXml = buildUrlSet(serviceEntries);

  const sitemapIndexXml = buildSitemapIndex([
    {
      loc: toAbsoluteUrl(config.baseUrl, '/sitemaps/sitemap-static.xml'),
      lastmod: generatedOn
    },
    {
      loc: toAbsoluteUrl(config.baseUrl, '/sitemaps/sitemap-services.xml'),
      lastmod: generatedOn
    }
  ]);

  await Promise.all([
    writeFileSafe(staticSitemapPath, staticSitemapXml),
    writeFileSafe(serviceSitemapPath, serviceSitemapXml),
    writeFileSafe(indexSitemapPath, sitemapIndexXml)
  ]);
};

main().catch((error) => {
  console.error('[sitemap] generation failed:', error);
  process.exitCode = 1;
});
