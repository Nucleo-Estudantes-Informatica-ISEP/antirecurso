'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { defaultLang, langFromPath, useTranslations, type Lang } from './translations';

const LanguageContext = createContext<Lang>(defaultLang);

export function LanguageProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const pathname = usePathname();
  const current = langFromPath(pathname ?? '') ?? lang;
  useEffect(() => {
    document.documentElement.lang = current;
  }, [current]);
  return <LanguageContext.Provider value={current}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useMessages() {
  return useTranslations(useLanguage());
}
