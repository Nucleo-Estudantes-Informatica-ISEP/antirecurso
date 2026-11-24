'use client';

import { useMessages, useLanguage } from '@/i18n/client';

import { localizedPath } from '@/i18n/translations';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, UserPlus } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import swal from 'sweetalert';

const Register: React.FC = () => {
  const t = useMessages();

  const lang = useLanguage();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? localizedPath('/', lang);

  async function handleRegister() {
    try {
      await signIn('zitadel', { callbackUrl }, { prompt: 'create' });
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
            <UserPlus className="size-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.register')}</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {t(
              'copy.registration_takes_place_on_the_official_nei_authentication_portal_create_your_accoun'
            )}
          </p>
        </div>

        <div className="space-y-3">
          <Button onClick={handleRegister} size="lg" className="w-full shadow-md shadow-primary/20">
            {t('copy.continue_to_the_portal')}
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <Separator />

        <div className="text-center text-sm">
          <Link
            className="text-primary font-medium hover:underline"
            href={localizedPath(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`, lang)}
          >
            {t('copy.already_have_an_account_sign_in')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
