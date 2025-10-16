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

const slugifySegment = (value) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

const buildVehicleSlug = (fuelType, brandSlug, modelSlug) => {
  const fuelSegment = slugifySegment(fuelType);
  const brandSegment = slugifySegment(brandSlug);
  const modelSegment = slugifySegment(modelSlug);
  return `${fuelSegment}-${brandSegment}-${modelSegment}-services`;
};

const normalizeSlugValue = (value, fallback) => {
  const trimmed = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
    return slugifySegment(fallback);
  }
  return slugifySegment(trimmed);
};

const toTitleCase = (value) =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ''))
    .join(' ')
    .trim();

const normalizeFuelTypes = (fuelTypes) => {
  const unique = new Set();
  (fuelTypes ?? []).forEach((fuel) => {
    if (!fuel || typeof fuel !== 'string') {
      return;
    }
    const normalized = toTitleCase(fuel.trim());
    if (normalized) {
      unique.add(normalized);
    }
  });
  return Array.from(unique);
};

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

const normalizeBrands = (brands) =>
  (brands ?? [])
    .filter((brand) => brand?.status)
    .map((brand) => ({
      name: brand.name?.trim() ?? '',
      slug: normalizeSlugValue(brand.slug, brand.name ?? '')
    }))
    .filter((brand) => brand.name && brand.slug);

const createBrandLookup = (brands) => {
  const lookup = new Map();
  brands.forEach((brand) => {
    lookup.set(brand.name.trim().toLowerCase(), brand);
  });
  return lookup;
};

const normalizeModels = (models, brandLookup) =>
  (models ?? [])
    .filter((model) => model?.status)
    .map((model) => {
      const brandKey = (model.brand_name ?? '').trim().toLowerCase();
      const brand = brandLookup.get(brandKey);
      if (!brand) {
        return null;
      }

      const fuelTypes = normalizeFuelTypes(model.fuel_type);
      if (fuelTypes.length === 0) {
        return null;
      }

      return {
        brandName: brand.name,
        brandSlug: brand.slug,
        modelName: model.name?.trim() ?? '',
        modelSlug: normalizeSlugValue(model.slug, model.name ?? ''),
        fuelTypes,
        updatedAt: model.updated_date ?? model.created_date ?? null
      };
    })
    .filter((model) => model && model.modelName && model.modelSlug);

const fetchVehicleCatalog = async (backendUrl) => {
  const params = new URLSearchParams({
    sortStatus: 'active-first',
    sortUpdated: 'desc',
    limit: '500'
  });

  const [brandResponse, modelResponse] = await Promise.all([
    fetchJson(`${ensureTrailingSlash(backendUrl)}v1/cars/brands?${params.toString()}`),
    fetchJson(`${ensureTrailingSlash(backendUrl)}v1/cars/models?${params.toString()}`)
  ]);

  if (!brandResponse?.success) {
    throw new Error(brandResponse?.message ?? 'Unable to fetch brands for sitemap generation.');
  }

  if (!modelResponse?.success) {
    throw new Error(modelResponse?.message ?? 'Unable to fetch models for sitemap generation.');
  }

  const brands = normalizeBrands(brandResponse.data);
  const brandLookup = createBrandLookup(brands);
  return normalizeModels(modelResponse.data, brandLookup);
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

const collectServiceEntries = (models, baseUrl, generatedOn) => {
  const entries = [];

  models.forEach((model) => {
    const lastmod = formatDate(model.updatedAt, generatedOn);
    model.fuelTypes.forEach((fuelType) => {
      const slug = buildVehicleSlug(fuelType, model.brandSlug, model.modelSlug);
      const route = `/services/${slug}`;
      entries.push({
        loc: toAbsoluteUrl(baseUrl, route),
        lastmod,
        changefreq: 'weekly',
        priority: '0.7'
      });
    });
  });

  return entries.sort((a, b) => a.loc.localeCompare(b.loc));
};

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

  const models = await fetchVehicleCatalog(config.backendUrl);

  const staticEntries = collectStaticEntries(config.staticRoutes, config.baseUrl, generatedOn);
  const serviceEntries = collectServiceEntries(models, config.baseUrl, generatedOn);

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
