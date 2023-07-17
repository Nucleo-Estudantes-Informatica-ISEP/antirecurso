'use client';

import { createContext, useEffect, useState } from 'react';

import User from '@/types/User';
import fetchSessionUser from '@/services/fetchSessionUser';
import getToken from '@/services/getToken';

export interface AuthContextData {
  user: User | null;
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
    <AuthContext.Provider value={{ user, clear, fetchToken }} {...props}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
