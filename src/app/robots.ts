import type { MetadataRoute } from 'next';
import { crawlerBlockedPaths, getSiteUrl } from '@/lib/seo';

export const dynamic = 'force-dynamic';

// Private pages are not disallowed here: they carry X-Robots-Tag noindex, which
// crawlers can only honour if they are allowed to fetch them.
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  return {
    rules: { userAgent: '*', allow: '/', disallow: [...crawlerBlockedPaths] },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
