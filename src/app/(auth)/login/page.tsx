'use client';

import PrimaryButton from '@/components/utils/PrimaryButton';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import swal from 'sweetalert';

const Login: React.FC = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

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
    <div className="relative flex flex-col items-center justify-center w-11/12 max-w-md px-4 py-12 sm:p-12 md:w-1/2 h-full">
      <div className="w-full dark:text-white -mt-8 md:mt-0">
        <h1 className="mb-6 text-2xl font-semibold">Bem-vindo!</h1>
        <p className="mb-8 text-sm leading-7 text-gray-600 dark:text-gray-300">
          O AntiRecurso utiliza agora o portal de autenticação do NEI. O login, registo e
          recuperação de palavra-passe acontecem todos na página oficial de autenticação.
        </p>

        <PrimaryButton type="button" className="block w-full" onClick={handleLogin}>
          Continuar para o login
        </PrimaryButton>

        <hr className="my-8" />

        <p className="mt-4">
          <Link
            className="text-sm font-medium text-primary-600 hover:underline"
            href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            Ainda não tens conta?
          </Link>
        </p>
        <p className="mt-2">
          <Link
            className="text-sm font-medium text-primary-600 hover:underline text-primary"
            href="/reset-password">
            Precisas de recuperar o acesso?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
