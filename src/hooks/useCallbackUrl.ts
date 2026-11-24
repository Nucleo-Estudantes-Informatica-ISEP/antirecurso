'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/i18n/client';
import { localizedPath, withoutLang } from '@/i18n/translations';

const useCallbackUrl = (): string => {
  const lang = useLanguage();
  const path = usePathname();
  const search = useSearchParams();
  const callback = search.get('callbackUrl');
  const authPage = ['/login', '/register'].includes(withoutLang(path));
  const destination =
    callback ??
    (authPage ? localizedPath('/', lang) : path + (search.size ? '?' + search.toString() : ''));
  return encodeURIComponent(destination);
};

export default useCallbackUrl;
