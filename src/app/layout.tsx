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
      <body className=" dark:bg-primary-dark">
        <ThemeProvider>
          <Topbar />
          <main className="flex min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
