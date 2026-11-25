import type { MetadataRoute } from 'next';
import { getSiteUrl, sitemapEntries } from '@/lib/seo';

// Origin comes from runtime configuration, so do not prerender at build time.
export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(getSiteUrl());
}
