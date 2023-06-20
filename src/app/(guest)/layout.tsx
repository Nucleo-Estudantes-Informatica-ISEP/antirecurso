import Topbar from '@/components/Topbar';
import '@/styles/globals.css';

export const metadata = {
  title: 'Anti Recurso',
  description: 'Anti Recurso | ISEP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen h-screen">
      <Topbar />
      <main className="my-8 min-h-[90vh]">{children}</main>
    </div>
  );
}
