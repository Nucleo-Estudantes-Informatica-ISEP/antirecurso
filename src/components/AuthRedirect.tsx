'use client';

import { useLanguage, useMessages } from '@/i18n/client';
import { localizedPath } from '@/i18n/translations';
import { startAuthNei } from '@/lib/client-auth-actions';
import { useSearchParams } from 'next/navigation';
import AuthLink from './AuthLink';
import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';

export default function AuthRedirect({
  register = false,
  helpUrl
}: {
  register?: boolean;
  helpUrl?: string;
}) {
  const lang = useLanguage();
  const t = useMessages();
  const searchParams = useSearchParams();
  const destination = searchParams.get('callbackUrl');
  const authError = searchParams.has('error');
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current || authError) return;
    started.current = true;
    void startAuthNei(destination, localizedPath('/', lang), register).catch(() => setFailed(true));
  }, [authError, destination, lang, register]);

  if (!failed && !authError) return null;

  const retry = `/${register ? 'register' : 'login'}?${new URLSearchParams(destination ? { callbackUrl: destination } : {})}`;

  return (
    <div className="space-y-4 p-6">
      <p role="alert">{t('copy.could_not_open_the_authentication_portal_please_try_again')}</p>
      <Button asChild>
        <AuthLink href={retry}>{t(register ? 'auth.register' : 'auth.login')}</AuthLink>
      </Button>
      {helpUrl && (
        <div>
          <a href={helpUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {t('auth.signInHelp')}
          </a>
          <p className="text-sm text-muted-foreground">{t('auth.signInHelpReturn')}</p>
        </div>
      )}
    </div>
  );
}
