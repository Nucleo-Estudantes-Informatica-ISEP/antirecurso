'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';

import { theme } from '@/../tailwind.config.js';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider attribute="class" defaultTheme={theme.defaultTheme} enableSystem {...props}>
      {children}
    </NextThemeProvider>
  );
}
