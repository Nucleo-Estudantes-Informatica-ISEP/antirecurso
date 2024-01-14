import React, { createContext, useState } from 'react';

export const ResetPasswordContext = createContext<{
  code: string | null;
  setCode: React.Dispatch<React.SetStateAction<string | null>>;
  email: string | null;
  setEmail: React.Dispatch<React.SetStateAction<string | null>>;
  password: string | null;
  setPassword: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  code: null,
  setCode: () => {}, // @typescript-eslint/no-empty-function
  email: null,
  setEmail: () => {}, // @typescript-eslint/no-empty-function
  password: null,
  setPassword: () => {} // @typescript-eslint/no-empty-function
});

interface ResetPasswordContextProviderProps {
  children: React.ReactNode;
}

const ResetPasswordContextProvider: React.FC<ResetPasswordContextProviderProps> = ({
  children
}) => {
  const [code, setCode] = useState<string | null>('');
  const [email, setEmail] = useState<string | null>('');
  const [password, setPassword] = useState<string | null>('');

  return (
    <ResetPasswordContext.Provider
      value={{ code, setCode, email, setEmail, password, setPassword }}>
      {children}
    </ResetPasswordContext.Provider>
  );
};

export default ResetPasswordContextProvider;
