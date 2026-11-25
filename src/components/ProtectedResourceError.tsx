'use client';

import { Button } from '@/components/ui/button';
import { useMessages } from '@/i18n/client';
import AuthLink from '@/components/AuthLink';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useCallbackUrl from '@/hooks/useCallbackUrl';

export default function ProtectedResourceError({
  status,
  onRetry,
  anchor,
  signInRequired = false
}: {
  status: number;
  onRetry?: () => void;
  anchor?: string;
  signInRequired?: boolean;
}) {
  const t = useMessages();
  const router = useRouter();
  const callback = useCallbackUrl();
  const retry = useCallback(() => router.refresh(), [router]);
  const destination = status === 401 ? callback + encodeURIComponent(anchor ?? '') : null;

  const signInMessage = signInRequired ? 'auth.signInToOpenExam' : 'auth.sessionExpiredForResource';

  return (
    <div role="alert" className="my-4 space-y-3 rounded-lg border p-4">
      <p>{t(destination ? signInMessage : 'error.resourceUnavailable')}</p>
      {destination ? (
        <Button asChild>
          <AuthLink href={`/login?callbackUrl=${destination}`}>{t('auth.login')}</AuthLink>
        </Button>
      ) : (
        <Button onClick={onRetry ?? retry}>{t('error.retryResource')}</Button>
      )}
    </div>
  );
}
