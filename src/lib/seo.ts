import type { Metadata } from 'next';
import type { MetadataRoute } from 'next';
import { languages, localizedPath, type Lang } from '@/i18n/translations';

const ogLocales: Record<Lang, string> = { pt: 'pt_PT', en: 'en_GB' };

/** Public frontend origin; NEXTAUTH_URL is already the canonical frontend URL. */
export function getSiteUrl(env: Record<string, string | undefined> = process.env): string {
  return (env.NEXTAUTH_URL || 'http://localhost:3000').replace(/\/+$/, '');
}

/** Public, crawlable pages (bare paths, without locale prefix). */
export const indexablePaths = [
  '/',
  '/exams',
  '/scoreboard',
  '/notes',
  '/about',
  '/changelog',
  '/privacy-policy',
  '/cookie-policy'
] as const;

/** Non-page paths that crawlers should not request at all. */
export const crawlerBlockedPaths = ['/api'] as const;

/**
 * Bare page prefixes served with `X-Robots-Tag: noindex` (see next.config.js).
 * They must stay crawlable: a robots.txt Disallow would hide that header and
 * keep already-discovered URLs in search results. Access control is separate.
 */
export const noindexPathPrefixes = [
  '/admin',
  '/login',
  '/register',
  '/profile',
  '/account',
  '/conta',
  '/reset-password',
  '/stats'
] as const;

interface MetadataInput {
  lang: Lang;
  path: string;
  title: string;
  description: string;
}

export function buildMetadata({ lang, path, title, description }: MetadataInput): Metadata {
  const url = localizedPath(path, lang);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(languages.map((l) => [l, localizedPath(path, l)])),
        'x-default': localizedPath(path, 'pt')
      }
    },
    openGraph: {
      type: 'website',
      siteName: 'AntiRecurso',
      title,
      description,
      url,
      locale: ogLocales[lang],
      alternateLocale: languages.filter((l) => l !== lang).map((l) => ogLocales[l]),
      images: [{ url: '/images/logo.png', alt: 'AntiRecurso' }]
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/images/logo.png'] }
  };
}

export function sitemapEntries(siteUrl: string): MetadataRoute.Sitemap {
  return indexablePaths.flatMap((path) => {
    const languagesMap = Object.fromEntries(
      languages.map((l) => [l, siteUrl + localizedPath(path, l)])
    );
    return languages.map((l) => ({
      url: siteUrl + localizedPath(path, l),
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1 : 0.7,
      alternates: { languages: languagesMap }
    }));
  });
}
