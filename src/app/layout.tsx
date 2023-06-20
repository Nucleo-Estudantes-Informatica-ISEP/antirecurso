import '@/styles/globals.css';

export const metadata = {
  title: 'Anti Recurso',
  description: 'Anti Recurso | ISEP'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
