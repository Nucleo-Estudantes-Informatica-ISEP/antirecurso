'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useMessages } from '@/i18n/client';
import Link, { useRouter } from '@/i18n/navigation';
import AuthLink from '@/components/AuthLink';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import useSession from '@/hooks/useSession';
import { apiRequest } from '@/services/apiClient';
import { switchAuthNeiAccount } from '@/lib/client-auth-actions';

export default function ResolveAccount() {
  const t = useMessages();
  const router = useRouter();
  const params = useSearchParams();
  const { user, isLoading, recoveryRequired, revalidate } = useSession();
  const [linking, setLinking] = useState(false);
  const [failed, setFailed] = useState(false);
  const original = params.get('callbackUrl');
  const localOrigin = 'https://antirecurso.invalid';
  let destination = '/profile';
  if (original?.startsWith('/')) {
    try {
      const url = new URL(original, localOrigin);
      if (url.origin === localOrigin && !url.pathname.startsWith('//')) {
        destination = url.pathname + url.search + url.hash;
      }
    } catch {
      // Use the profile when the return path cannot be parsed.
    }
  }

  async function linkAccount() {
    setLinking(true);
    setFailed(false);
    try {
      await apiRequest('user/account-resolution', {
        authenticated: true,
        method: 'POST',
        json: { action: 'keep' }
      });
      await revalidate();
      router.replace(destination);
      router.refresh();
    } catch {
      setFailed(true);
    } finally {
      setLinking(false);
    }
  }

  return (
    <section className="container w-full max-w-2xl py-12">
      <Card>
        <CardContent className="flex flex-col items-start gap-5 p-8">
          <h1 className="text-2xl font-bold">{t('auth.accountRecovery')}</h1>
          {isLoading ? (
            <p role="status">{t('auth.checkingAccount')}</p>
          ) : recoveryRequired ? (
            <>
              <p>{t('auth.accountProof')}</p>
              <a className="text-primary underline" href="mailto:support.antirecurso@nei-isep.org">
                {t('auth.contactAccountSupport')}
              </a>
              <Button onClick={revalidate}>{t('auth.checkAccountAgain')}</Button>
              <Button variant="outline" onClick={() => switchAuthNeiAccount(destination)}>
                {t('auth.switchAccount')}
              </Button>
            </>
          ) : user?.requires_account_resolution ? (
            <>
              <p>{t('auth.linkPreservesHistory')}</p>
              {failed && (
                <p role="alert">{t('copy.could_not_resolve_the_account_please_try_again')}</p>
              )}
              <Button onClick={linkAccount} disabled={linking}>
                {t('copy.link_account')}
              </Button>
            </>
          ) : user ? (
            <>
              <p>{t('copy.your_account_does_not_need_to_be_linked')}</p>
              <Button asChild>
                <Link href={destination}>{t('auth.openAccountHistory')}</Link>
              </Button>
            </>
          ) : (
            <Button asChild>
              <AuthLink href="/login">{t('auth.login')}</AuthLink>
            </Button>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
