'use client';

import Link from '@/i18n/navigation';
import { useLanguage, useMessages } from '@/i18n/client';
import { localizedPath, withoutLang } from '@/i18n/translations';
import { startAuthNei } from '@/lib/client-auth-actions';
import type { ComponentProps } from 'react';
import swal from 'sweetalert';

export default function AuthLink({
  href,
  onClick,
  ...props
}: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  const lang = useLanguage();
  const t = useMessages();
  return (
    <Link
      {...props}
      href={href}
      prefetch={false}
      onClick={async (event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey
        )
          return;
        event.preventDefault();
        const url = new URL(href, window.location.origin);
        try {
          await startAuthNei(
            url.searchParams.get('callbackUrl'),
            localizedPath('/', lang),
            withoutLang(url.pathname) === '/register'
          );
        } catch {
          await swal(
            'Oops!',
            t('copy.could_not_open_the_authentication_portal_please_try_again'),
            'error'
          );
        }
      }}
    />
  );
}
