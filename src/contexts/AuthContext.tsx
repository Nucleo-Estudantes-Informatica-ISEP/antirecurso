'use client';

import { createContext, useEffect, useState } from 'react';

import User from '@/types/User';

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
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const revalidate = async () => {
    const session = await fetchSession();
    if (!session) return;

    const { token, user } = session;
    setToken(token);
    setUser(user);
  };

  const clear = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    revalidate();
  }, []);

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

  if (res.status === 200) return (await res.json()) as SessionData;
  return null;
}

export default AuthContext;
