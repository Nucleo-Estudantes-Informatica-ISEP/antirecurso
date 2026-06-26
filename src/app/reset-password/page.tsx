'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, KeyRound } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import swal from 'sweetalert';

const ResetPassword: React.FC = () => {
  async function handleOpenAuthPortal() {
    try {
      await signIn('zitadel', { callbackUrl: '/' });
    } catch {
      await swal(
        'Oops!',
        'Não foi possível abrir o portal de autenticação. Por favor tenta novamente.',
        'error'
      );
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full px-6 py-12 sm:px-12 sm:py-16 min-h-[36rem]">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-primary/10 text-primary">
            <KeyRound className="size-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Recuperar acesso</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            A recuperação da palavra-passe é feita no portal de autenticação do NEI. Abre o portal
            e usa a opção de recuperação de password nessa página.
          </p>
        </div>

        <Button
          onClick={handleOpenAuthPortal}
          size="lg"
          className="w-full shadow-md shadow-primary/20"
        >
          Abrir portal de autenticação
          <ArrowRight className="size-4" />
        </Button>

        <Separator />

        <div className="text-center text-sm">
          <Link className="text-primary font-medium hover:underline" href="/login">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
