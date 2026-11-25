'use client';

import { useEffect, useId, useRef, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/i18n/client';
import {
  isLang,
  langLabels,
  languages,
  languageCookie,
  localizedPath,
  useTranslations
} from '@/i18n/translations';

export default function LanguageSelect() {
  const id = useId();
  const lang = useLanguage();
  const t = useTranslations(lang);
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const refreshDestination = useRef<string | null>(null);

  useEffect(() => {
    if (!refreshDestination.current || refreshDestination.current !== pathname) return;
    refreshDestination.current = null;
    // Refresh after navigation so server-rendered copy uses the new URL language.
    // Next merges the response while retaining client state (including an exam).
    router.refresh();
  }, [pathname, router]);

  function changeLanguage(value: string) {
    if (!isLang(value) || value === lang) return;
    document.cookie = `${languageCookie}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    const destination = localizedPath(
      `${pathname}${window.location.search}${window.location.hash}`,
      value
    );
    refreshDestination.current = localizedPath(pathname ?? '/', value);
    startTransition(() => router.replace(destination, { scroll: false }));
  }

  return (
    <>
      <label htmlFor={id} className="sr-only">
        {t('languageSwitcher.label')}
      </label>
      <select
        id={id}
        value={lang}
        disabled={pending}
        onChange={(event) => changeLanguage(event.target.value)}
        className="rounded-md border bg-background px-2 py-2 text-sm text-foreground"
      >
        {languages.map((value) => (
          <option key={value} value={value} lang={value}>
            {langLabels[value]}
          </option>
        ))}
      </select>
    </>
  );
}
