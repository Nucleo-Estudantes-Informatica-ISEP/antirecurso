'use client';

import useSession from '@/hooks/useSession';
import { useRouter } from '@/i18n/navigation';
import { signOut } from 'next-auth/react';

export default function useAuthNeiSignOut() {
  const { clear } = useSession();
  const router = useRouter();
  return async (scope: 'app' | 'shared') => {
    let sharedUrl: string | undefined;
    if (scope === 'shared') {
      try {
        const response = await fetch('/api/auth/logout', { method: 'PATCH' });
        if (!response.ok) throw new Error('AuthNEI sign-out unavailable');
        const { url } = (await response.json()) as { url?: string };
        if (!url) throw new Error('AuthNEI end-session URL unavailable');
        sharedUrl = url;
      } catch {
        return 'auth.sharedSignOutUnavailable' as const;
      }
    }

    try {
      await signOut({ redirect: false });
      clear();
    } catch {
      return 'auth.appSignOutFailed' as const;
    }

    if (sharedUrl) {
      window.location.assign(sharedUrl);
    } else {
      router.push('/');
      router.refresh();
    }
  };
}
