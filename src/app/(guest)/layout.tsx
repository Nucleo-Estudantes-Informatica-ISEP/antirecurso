import Topbar from '@/components/Topbar';
import '@/styles/globals.css';

export const metadata = {
  title: 'Anti Recurso',
  description: 'Anti Recurso | ISEP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <body className="min-h-screen">
      <Topbar />
      <main>{children}</main>
    </body>
  );
}
