export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen h-screen">
      <main className="my-8 min-h-[90vh]">{children}</main>
    </div>
  );
}
