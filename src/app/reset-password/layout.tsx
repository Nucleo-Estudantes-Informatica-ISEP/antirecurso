'use client';

import ResetPasswordContextProvider from '@/contexts/ResetPasswordContext';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <ResetPasswordContextProvider>
      <div className="relative flex items-center justify-center w-full p-4 md:p-8 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] pointer-events-none" />

        <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-2xl lg:grid-cols-2">
          <div className="relative hidden lg:block">
            <Image
              aria-hidden="true"
              fill
              className="object-cover"
              src="/images/login-office.jpeg"
              alt="Office"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-brand-600/70 to-brand-800/80" />
            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
              <p className="text-3xl font-bold leading-tight">
                Recupera o teu <br />
                <span className="text-white">acesso</span>
              </p>
              <p className="mt-4 text-white/85 max-w-sm">
                A partir do portal oficial do NEI consegues redefinir a tua palavra-passe em segundos.
              </p>
            </div>
          </div>
          <div className="relative">{children}</div>
        </div>
      </div>
    </ResetPasswordContextProvider>
  );
};

export default AuthLayout;
