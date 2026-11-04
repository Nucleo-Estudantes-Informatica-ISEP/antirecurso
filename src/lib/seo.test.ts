import { describe, expect, it } from 'vitest';
import {
  buildMetadata,
  getSiteUrl,
  indexablePaths,
  noindexPathPrefixes,
  sitemapEntries
} from './seo';

describe('seo', () => {
  it('derives the site origin from NEXTAUTH_URL without a trailing slash', () => {
    expect(getSiteUrl({ NEXTAUTH_URL: 'https://antirecurso.nei-isep.org/' })).toBe(
      'https://antirecurso.nei-isep.org'
    );
    expect(getSiteUrl({})).toBe('http://localhost:3000');
  });

  it('builds canonical, hreflang and social metadata consistent with locale URLs', () => {
    const meta = buildMetadata({ lang: 'en', path: '/exams', title: 'Exams', description: 'D' });
    expect(meta.alternates?.canonical).toBe('/en/exams');
    expect(meta.alternates?.languages).toEqual({
      pt: '/pt/exams',
      en: '/en/exams',
      'x-default': '/pt/exams'
    });
    expect(meta.openGraph).toMatchObject({
      title: 'Exams',
      description: 'D',
      locale: 'en_GB',
      alternateLocale: ['pt_PT']
    });
    expect(meta.twitter).toMatchObject({ card: 'summary_large_image', title: 'Exams' });
  });

  it('uses the bare locale URL for the home page', () => {
    const meta = buildMetadata({ lang: 'pt', path: '/', title: 'T', description: 'D' });
    expect(meta.alternates?.canonical).toBe('/pt');
    expect(meta.alternates?.languages?.en).toBe('/en');
  });

  it('lists every indexable page in both languages with alternates', () => {
    const entries = sitemapEntries('https://x.test');
    expect(entries).toHaveLength(indexablePaths.length * 2);
    const exams = entries.find((e) => e.url === 'https://x.test/en/exams');
    expect(exams?.alternates?.languages).toEqual({
      pt: 'https://x.test/pt/exams',
      en: 'https://x.test/en/exams'
    });
    expect(entries.some((e) => /admin|login|profile|api/.test(e.url))).toBe(false);
  });

  it('keeps account and admin pages out of the sitemap and marks them noindex', () => {
    for (const p of ['/admin', '/login', '/profile']) {
      expect(noindexPathPrefixes).toContain(p);
      expect(indexablePaths).not.toContain(p);
    }
  });
});
