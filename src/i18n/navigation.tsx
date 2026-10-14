'use client';

import NextLink from 'next/link';
import { useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation';
import { useMemo, useRef, type ComponentProps } from 'react';
import { useLanguage } from './client';
import { langFromPath, localizedPath, withoutLang, type Lang } from './translations';

function pagePath(path: string, lang: Lang) {
  return langFromPath(path) ? path : localizedPath(path, lang);
}

export default function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const lang = useLanguage();
  const localized =
    typeof href === 'string'
      ? pagePath(href, lang)
      : { ...href, pathname: href.pathname ? pagePath(href.pathname, lang) : href.pathname };
  return <NextLink href={localized} {...props} />;
}

export function usePathname() {
  return withoutLang(useNextPathname() ?? '/');
}

export function useRouter() {
  const router = useNextRouter();
  const lang = useLanguage();
  const current = useRef(lang);
  current.current = lang;
  // Keep the router identity stable when only the language changes, so effects
  // which load an exam do not start a second exam on language selection.
  return useMemo(
    () => ({
      ...router,
      push: (path: string, options?: Parameters<typeof router.push>[1]) =>
        router.push(pagePath(path, current.current), options),
      replace: (path: string, options?: Parameters<typeof router.replace>[1]) =>
        router.replace(pagePath(path, current.current), options),
      prefetch: (path: string, options?: Parameters<typeof router.prefetch>[1]) =>
        router.prefetch(pagePath(path, current.current), options)
    }),
    [router]
  );
}
