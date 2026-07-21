import type { MetadataRoute } from 'next';
import { env } from '@/shared/config/env';
import { DESTINATION_ROUTES } from '@/shared/config/routes';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ['', '/saved', '/search', '/transparency', '/terms', '/privacy'];
  return [
    ...staticRoutes.map((path) => ({ url: `${env.siteUrl}${path}`, lastModified: now, changeFrequency: 'weekly' as const })),
    ...DESTINATION_ROUTES.flatMap(({ country, cities }) => [
      { url: `${env.siteUrl}/${country}`, lastModified: now, changeFrequency: 'weekly' as const },
      ...cities.map((city) => ({ url: `${env.siteUrl}/${country}/${city}`, lastModified: now, changeFrequency: 'weekly' as const })),
    ]),
  ];
}