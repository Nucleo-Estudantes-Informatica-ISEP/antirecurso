'use client';

import useSession from '@/hooks/useSession';
import { useMessages } from '@/i18n/client';
import { useRouter } from '@/i18n/navigation';
import { signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import swal from 'sweetalert';

export default function useAuthNeiSignOut() {
  const t = useMessages();
  const { clear } = useSession();
  const router = useRouter();
  const { theme } = useTheme();
  const className = theme === 'dark' ? 'swal-dark' : '';

  return async () => {
    const scope = await swal({
      title: t('auth.logout'),
      text: t('auth.signOutOtherApps'),
      buttons: {
        cancel: { text: t('copy.cancel'), visible: true },
        app: { text: t('auth.signOutApp'), value: 'app' },
        shared: { text: t('auth.signOutShared'), value: 'shared' }
      },
      className
    });
    if (scope !== 'app' && scope !== 'shared') return;

    let sharedUrl: string | undefined;
    if (scope === 'shared') {
      try {
        const response = await fetch('/api/auth/logout', { method: 'PATCH' });
        if (!response.ok) throw new Error('AuthNEI sign-out unavailable');
        const { url } = (await response.json()) as { url?: string };
        if (!url) throw new Error('AuthNEI end-session URL unavailable');
        sharedUrl = url;
      } catch {
        await swal({ title: t('auth.sharedSignOutUnavailable'), icon: 'error', className });
        return;
      }
    }

    try {
      await signOut({ redirect: false });
      clear();
    } catch {
      await swal({ title: t('auth.appSignOutFailed'), icon: 'error', className });
      return;
    }

    if (sharedUrl) {
      window.location.assign(sharedUrl);
    } else {
      router.push('/');
      router.refresh();
    }
  };
}
