'use client';

import { createContext, useCallback, useEffect, useState } from 'react';

import User from '@/types/User';
import swal from 'sweetalert';
import {
  defaultLang,
  langFromPath,
  localizedPath,
  withoutLang,
  useTranslations as translate
} from '@/i18n/translations';

interface SessionData {
  user: User | null;
  token: string | null;
  recoveryRequired?: boolean;
}

export interface AuthContextData extends SessionData {
  clear: () => void;
  isLoading: boolean;
  revalidate: () => void;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthContextProvider({ children, ...props }: AuthContextProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [recoveryRequired, setRecoveryRequired] = useState(false);

  const clear = useCallback(() => {
    setUser(null);
    setToken(null);
    setRecoveryRequired(false);
  }, []);

  const revalidate = useCallback(async () => {
    setIsLoading(true);
    try {
      const session = await fetchSession();
      if (!session) {
        // Being unauthenticated is a valid application state. Redirecting to `/`
        // from the root layout causes an infinite full-page reload when the
        // session endpoint returns 401, including for normal logged-out visitors.
        clear();
        return;
      }

      const { token, user } = session;
      setToken(token);
      setUser(user);
      setRecoveryRequired(session.recoveryRequired === true);
    } finally {
      setIsLoading(false);
    }
  }, [clear]);

  useEffect(() => {
    revalidate();
  }, [revalidate]);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, recoveryRequired, clear, revalidate }}
      {...props}
    >
      {children}
    </AuthContext.Provider>
  );
}

async function fetchSession(): Promise<SessionData | null> {
  const res = await fetch('/api/auth/session', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const pathname = window.location.pathname;
  const local = withoutLang(pathname);
  const lang = langFromPath(pathname) ?? defaultLang;
  const recover = () => {
    if (local === '/account/resolve' || local === '/conta/resolver') return;
    const callbackUrl = encodeURIComponent(pathname + window.location.search);
    window.location.href = localizedPath(`/account/resolve?callbackUrl=${callbackUrl}`, lang);
  };

  if (res.status === 200) {
    const data = (await res.json()) as SessionData & { user: User };
    if (data.user.requires_account_resolution) recover();
    return data;
  }
  if (res.status === 403) {
    const payload: unknown = await res.json().catch(() => null);
    if (
      payload &&
      typeof payload === 'object' &&
      'code' in payload &&
      payload.code === 'ACCOUNT_RECOVERY_REQUIRED'
    ) {
      recover();
      return { user: null, token: null, recoveryRequired: true };
    }
  }
  if (res.status === 401) return null;

  if (res.status === 404) {
    const t = translate(lang);
    await swal(t('auth.expired'), t('auth.signInAgain'), 'error');
  }
  return null;
}

export default AuthContext;
