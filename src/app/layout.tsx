import ChangelogPopUp from '@/components/changelog/ChangelogPopUp';
import Topbar from '@/components/navbar/Topbar';
import CookieConsent from '@/components/utils/CookieConsent';
import ThemeProvider from '@/components/utils/Theme/ThemeProvider';
import { AuthContextProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';
import { Suspense } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'AntiRecurso',
  description: 'AntiRecurso | NEI-ISEP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className={`min-h-screen bg-background text-foreground antialiased transition-colors font-sans ${inter.variable}`}>
        <AuthContextProvider>
          <ThemeProvider>
            <Suspense>
              <div className="relative flex min-h-screen flex-col">
                <Topbar />
                <main className="flex-1 flex">
                  <div className="flex items-stretch w-full min-h-[calc(100vh-4.5rem)]">
                    {children}
                  </div>
                </main>
              </div>
              <ChangelogPopUp />
            </Suspense>
            <CookieConsent />
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
