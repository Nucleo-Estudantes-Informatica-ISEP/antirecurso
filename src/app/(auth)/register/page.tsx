'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, UserPlus } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import swal from 'sweetalert';

const Register: React.FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  async function handleRegister() {
    try {
      await signIn('zitadel', { callbackUrl });
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
            <UserPlus className="size-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Criar conta</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            O registo passou para o portal oficial de autenticação do NEI. Continua no portal e
            cria lá a tua conta para regressares automaticamente ao AntiRecurso.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleRegister}
            size="lg"
            className="w-full shadow-md shadow-primary/20"
          >
            Continuar para o portal
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <Separator />

        <div className="text-center text-sm">
          <Link
            className="text-primary font-medium hover:underline"
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Já tens conta? Inicia sessão
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
