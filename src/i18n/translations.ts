import pt from './pt.json';
import en from './en.json';

export const languages = ['pt', 'en'] as const;
export type Lang = (typeof languages)[number];
export type TranslationKey = keyof typeof pt;
export const defaultLang: Lang = 'pt';
export const languageCookie = 'locale';
export const langLabels: Record<Lang, string> = { pt: 'Português', en: 'English' };

const translations: Record<Lang, Record<TranslationKey, string>> = { pt, en };

export function isLang(value: unknown): value is Lang {
  return value === 'pt' || value === 'en';
}

export function langFromPath(path: string): Lang | undefined {
  const lang = path.split(/[/?#]/)[1];
  return isLang(lang) ? lang : undefined;
}

export function withoutLang(path: string): string {
  return langFromPath(path) ? path.replace(/^\/(pt|en)(?=\/|\?|#|$)/, '') || '/' : path;
}

export function localizedPath(path: string, lang: Lang): string {
  if (!path.startsWith('/') || path.startsWith('//') || /^\/api(?:\/|\?|$)/.test(path)) return path;
  const bare = withoutLang(path);
  return `/${lang}${bare === '/' ? '' : bare}`;
}

export function getLangFromUrl(url: URL): Lang {
  return langFromPath(url.pathname) ?? defaultLang;
}

// Same dictionary lookup pattern as sei-isep-2026; no i18n dependency.
const translators = {
  pt: (key: TranslationKey): string => translations.pt[key],
  en: (key: TranslationKey): string => translations.en[key] ?? pt[key]
};

export function useTranslations(lang: Lang) {
  return translators[lang];
}

// Only used when the visitor has not supplied a language in the URL.
export function preferredLang(cookie: unknown, acceptLanguage: string | null): Lang {
  if (isLang(cookie)) return cookie;
  const choices = (acceptLanguage ?? '').split(',').map((entry) => {
    const [tag, ...parameters] = entry.trim().toLowerCase().split(';');
    const quality = parameters.find((part) => part.trim().startsWith('q='));
    return { lang: tag.split('-')[0], quality: quality ? Number(quality.trim().slice(2)) : 1 };
  });
  choices.sort((a, b) => b.quality - a.quality);
  return (
    (choices.find((entry) => isLang(entry.lang) && entry.quality > 0 && entry.quality <= 1)
      ?.lang as Lang | undefined) ?? defaultLang
  );
}
