import { describe, expect, it } from 'vitest';
import pt from './pt.json';
import en from './en.json';
import {
  getLangFromUrl,
  localizedPath,
  preferredLang,
  useTranslations,
  withoutLang
} from './translations';

describe('language selection', () => {
  it('uses an explicit URL even when the saved choice and browser disagree', () => {
    expect(getLangFromUrl(new URL('https://example.org/en/exams'))).toBe('en');
    expect(preferredLang('pt', 'en-US')).toBe('pt');
  });
  it('uses weighted browser preferences, then Portuguese', () => {
    expect(preferredLang(undefined, 'fr,en-GB;q=0.9,pt;q=0.5')).toBe('en');
    expect(preferredLang('invalid', 'en;q=0,pt;q=0.8')).toBe('pt');
    expect(preferredLang(undefined, 'de')).toBe('pt');
    expect(preferredLang(undefined, null)).toBe('pt');
  });
  it('preserves page, IDs, query and fragment', () => {
    expect(localizedPath('/pt/exams/12?mode=custom#question', 'en')).toBe(
      '/en/exams/12?mode=custom#question'
    );
    expect(localizedPath('/en?from=home', 'pt')).toBe('/pt?from=home');
    expect(localizedPath('/', 'pt')).toBe('/pt');
    expect(withoutLang('/en/admin/users')).toBe('/admin/users');
  });
  it('leaves API and external links untouched', () => {
    for (const path of ['/api/auth/profile', 'https://example.org', '//example.org']) {
      expect(localizedPath(path, 'en')).toBe(path);
    }
  });
  it('provides both dictionaries and typed lookup', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(pt).sort());
    expect(useTranslations('pt')('nav.exams')).toBe('Exames');
    expect(useTranslations('en')('nav.exams')).toBe('Exams');
  });
});

it('falls back to Portuguese when an English value is missing at runtime', () => {
  const original = en['nav.exams'];
  try {
    delete (en as Partial<typeof en>)['nav.exams'];
    expect(useTranslations('en')('nav.exams')).toBe('Exames');
  } finally {
    en['nav.exams'] = original;
  }
});
