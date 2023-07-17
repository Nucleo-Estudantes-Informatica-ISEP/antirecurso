'use client';

import { createContext, useEffect, useState } from 'react';

import fetchSessionUser from '@/services/fetchSessionUser';
import User from '@/types/User';

export interface AuthContextData {
  user: User | null;
  token: string | null;
  clear: () => void;
  fetchToken: () => void;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthContextProvider({ children, ...props }: AuthContextProviderProps) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchToken = async () => {
    const token = await getToken();
    setToken(token);
  };

  const fetchSession = async (token: string) => {
    const user = await fetchSessionUser(token);
    setUser(user);
  };

  const clear = () => {
    setUser(null);
    setToken(null);
  };

  useEffect(() => {
    if (!token) return;
    fetchSession(token);
  }, [token]);

  useEffect(() => {
    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, clear, fetchToken }} {...props}>
      {children}
    </AuthContext.Provider>
  );
}

async function getToken(): Promise<string | null> {
  const res = await fetch('/api/auth/session', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.status === 200) return (await res.json()).data;
  return null;
}

export default AuthContext;
