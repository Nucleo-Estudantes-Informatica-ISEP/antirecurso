'use client';

import { useMessages, useLanguage } from '@/i18n/client';

import { localizedPath } from '@/i18n/translations';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import swal from 'sweetalert';

const Login: React.FC = () => {
  const t = useMessages();

  const lang = useLanguage();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? localizedPath('/', lang);

  async function handleLogin() {
    try {
      await signIn('zitadel', { callbackUrl });
    } catch {
      await swal(
        'Oops!',
        t('copy.could_not_open_the_authentication_portal_please_try_again'),
        'error'
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-12 sm:px-12 sm:py-16 min-h-[36rem]">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t('copy.welcome_back')}</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {t(
              'copy.antirecurso_uses_the_nei_authentication_portal_sign_in_registration_and_password_reco'
            )}
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleLogin} size="lg" className="w-full shadow-md shadow-primary/20">
            {t('copy.continue_to_sign_in')}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <Separator />

        <div className="space-y-3 text-center text-sm">
          <Link
            className="block text-primary font-medium hover:underline"
            href={localizedPath(`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`, lang)}
          >
            {t('copy.no_account_yet_create_one_now')}
          </Link>
          <Link
            className="block text-muted-foreground hover:text-foreground hover:underline"
            href={localizedPath('/reset-password', lang)}
          >
            {t('copy.need_to_recover_access')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
