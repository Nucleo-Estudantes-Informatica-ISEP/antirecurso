'use client';

import { useLanguage, useMessages } from '@/i18n/client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from '@/i18n/navigation';
import swal from 'sweetalert';

const ResetPasswordVerify: React.FC = () => {
  const t = useMessages();
  const lang = useLanguage();

  async function handleOpenAuthPortal() {
    try {
      await signIn('zitadel', { callbackUrl: `/${lang}` });
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
          <h1 className="text-3xl font-bold tracking-tight">{t('copy.access_verification')}</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            {t(
              'copy.credential_verification_and_recovery_now_take_place_directly_on_the_authnei_portal_op'
            )}
          </p>
        </div>

        <Button
          onClick={handleOpenAuthPortal}
          size="lg"
          className="w-full shadow-md shadow-primary/20"
        >
          {t('copy.open_authentication_portal')}
          <ArrowRight className="size-4" />
        </Button>

        <Separator />

        <div className="text-center text-sm">
          <Link className="text-primary font-medium hover:underline" href="/login">
            {t('copy.back_to_sign_in')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordVerify;
