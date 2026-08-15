'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import swal from 'sweetalert';

const Login: React.FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';
  const studentProvisioned = searchParams.get('studentProvisioned') === 'true';

  async function handleLogin() {
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
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta</h1>
          <p className="text-sm leading-6 text-muted-foreground">
            O AntiRecurso usa o portal de autenticação do NEI. O login, registo e recuperação de
            palavra-passe acontecem todos na página oficial.
          </p>
        </div>

        <div className="space-y-3">
          {studentProvisioned ? (
            <p className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm">
              Conta classificada como estudante. Continua novamente para obter uma sessão com os
              novos acessos.
            </p>
          ) : null}
          <Button onClick={handleLogin} size="lg" className="w-full shadow-md shadow-primary/20">
            Continuar para o login
            <ArrowRight className="size-4" />
          </Button>
        </div>

        <Separator />

        <div className="space-y-3 text-center text-sm">
          <Link
            className="block text-primary font-medium hover:underline"
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            Ainda não tens conta? Cria uma agora
          </Link>
          <Link
            className="block text-muted-foreground hover:text-foreground hover:underline"
            href="/reset-password"
          >
            Precisas de recuperar o acesso?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
