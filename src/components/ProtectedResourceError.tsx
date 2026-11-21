'use client';

import { Button } from '@/components/ui/button';
import { useMessages } from '@/i18n/client';
import Link from '@/i18n/navigation';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useCallbackUrl from '@/hooks/useCallbackUrl';

export default function ProtectedResourceError({
  status,
  onRetry,
  anchor
}: {
  status: number;
  onRetry?: () => void;
  anchor?: string;
}) {
  const t = useMessages();
  const router = useRouter();
  const callback = useCallbackUrl();
  const retry = useCallback(() => router.refresh(), [router]);
  const destination = status === 401 ? callback + encodeURIComponent(anchor ?? '') : null;

  return (
    <div role="alert" className="my-4 space-y-3 rounded-lg border p-4">
      <p>{t(destination ? 'auth.sessionExpiredForResource' : 'error.resourceUnavailable')}</p>
      {destination ? (
        <Button asChild>
          <Link href={`/login?callbackUrl=${destination}`}>{t('auth.login')}</Link>
        </Button>
      ) : (
        <Button onClick={onRetry ?? retry}>{t('error.retryResource')}</Button>
      )}
    </div>
  );
}
