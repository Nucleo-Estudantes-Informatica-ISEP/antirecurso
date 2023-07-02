import ThemeProvider from '@/components/Theme/ThemeProvider';
import Topbar from '@/components/Topbar';
import '@/styles/globals.css';

export const metadata = {
  title: 'Anti Recurso',
  description: 'Anti Recurso | ISEP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="transition-colors dark:bg-primary-dark">
        <ThemeProvider>
          <Topbar />
          <main className="flex">
            <div className="flex items-stretch w-full min-h-[calc(100vh-5rem)]">{children}</div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
