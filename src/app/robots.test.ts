import { describe, expect, it } from 'vitest';
import nextConfig from '../../next.config.js';
import { languages } from '@/i18n/translations';
import { noindexPathPrefixes } from '@/lib/seo';
import robots from './robots';

const noindexPages = noindexPathPrefixes.flatMap((prefix) => [
  prefix,
  ...languages.map((lang) => `/${lang}${prefix}`)
]);

function disallowRules(): string[] {
  const { rules } = robots();
  const list = Array.isArray(rules) ? rules : [rules];
  return list.flatMap((rule) => [rule.disallow ?? []].flat());
}

describe('robots.txt', () => {
  it('lets crawlers fetch noindex pages so they can see the X-Robots-Tag header', () => {
    const disallow = disallowRules();
    for (const page of noindexPages) {
      expect(disallow.filter((rule) => page.startsWith(rule))).toEqual([]);
    }
  });

  it('keeps API routes out of crawling and links the sitemap', () => {
    const result = robots();
    expect(disallowRules()).toContain('/api');
    expect(result.sitemap).toMatch(/\/sitemap\.xml$/);
  });

  it('serves every noindex page prefix with X-Robots-Tag noindex in both languages', async () => {
    const headers = (await nextConfig.headers?.()) ?? [];
    const noindexSources = headers
      .filter((entry) =>
        entry.headers.some((h) => h.key === 'X-Robots-Tag' && h.value.includes('noindex'))
      )
      .map((entry) => entry.source);
    for (const prefix of noindexPathPrefixes) {
      expect(noindexSources).toContain(`/:lang(pt|en)${prefix}/:path*`);
    }
  });
});
