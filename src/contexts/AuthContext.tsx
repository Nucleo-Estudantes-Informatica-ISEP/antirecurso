'use client';

import { createContext, useCallback, useEffect, useState } from 'react';

import User from '@/types/User';
import swal from 'sweetalert';

interface SessionData {
  user: User | null;
  token: string | null;
}

export interface AuthContextData extends SessionData {
  clear: () => void;
  revalidate: () => void;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthContextProvider({ children, ...props }: AuthContextProviderProps) {
  // isLoading could be implemented to prevent the user from seeing the no auth version for a split second
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const clear = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const revalidate = useCallback(async () => {
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
  }, [clear]);

  useEffect(() => {
    revalidate();
  }, [revalidate]);

  return (
    <AuthContext.Provider value={{ user, token, clear, revalidate }} {...props}>
      {children}
    </AuthContext.Provider>
  );
}

async function fetchSession(): Promise<SessionData | null> {
  const res = await fetch('/api/auth/session', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.status === 200) {
    const data = (await res.json()) as SessionData & { user: User };
    if (
      data.user.requires_account_resolution &&
      window.location.pathname !== '/account/resolve'
    ) {
      window.location.href = '/account/resolve';
    }
    return data;
  }
  if (res.status === 401) return null;

  if (res.status === 404) {
    await swal('Sessão expirada', 'Por favor, inicia sessão novamente.', 'error');
  }
  return null;
}

export default AuthContext;
