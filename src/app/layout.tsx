import ChangelogPopUp from '@/components/changelog/ChangelogPopUp';
import Topbar from '@/components/navbar/Topbar';
import CookieConsent from '@/components/utils/CookieConsent';
import ThemeProvider from '@/components/utils/Theme/ThemeProvider';
import { AuthContextProvider } from '@/contexts/AuthContext';
import '@/styles/globals.css';
import { Suspense } from 'react';

export const metadata = {
  title: 'AntiRecurso',
  description: 'AntiRecurso | NEI-ISEP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="transition-colors dark:bg-primary-dark">
        <AuthContextProvider>
          <ThemeProvider>
            <Suspense>
              <Topbar />
              <main className="flex">
                <div className="flex items-stretch w-full min-h-[calc(100vh-5rem)]">{children}</div>
              </main>
              <ChangelogPopUp />
            </Suspense>
            <CookieConsent />
          </ThemeProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
