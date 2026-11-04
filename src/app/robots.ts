import type { MetadataRoute } from 'next';
import { languages } from '@/i18n/translations';
import { getSiteUrl, privatePathPatterns } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const disallow = privatePathPatterns.flatMap((path) =>
    path === '/api' ? [path] : [path, ...languages.map((lang) => `/${lang}${path}`)]
  );
  return {
    rules: { userAgent: '*', allow: '/', disallow },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl
  };
}
