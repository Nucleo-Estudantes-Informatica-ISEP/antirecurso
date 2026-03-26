'use client';

import PrimaryButton from '@/components/utils/PrimaryButton';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import swal from 'sweetalert';

const ResetPasswordVerify: React.FC = () => {
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
    <div className="relative flex flex-col items-center justify-center w-11/12 max-w-md px-4 py-12 sm:p-12 md:w-1/2 h-full">
      <div className="w-full dark:text-white -mt-8 md:mt-0">
        <h1 className="mb-6 text-2xl font-semibold">Verificação de acesso</h1>
        <p className="mb-8 text-sm leading-7 text-gray-600 dark:text-gray-300">
          A verificação e recuperação de credenciais acontecem agora diretamente no portal do
          AuthNEI. Abre o portal para continuar.
        </p>

        <PrimaryButton type="button" className="block w-full" onClick={handleOpenAuthPortal}>
          Abrir portal de autenticação
        </PrimaryButton>

        <hr className="my-8" />

        <p className="mt-4">
          <Link className="text-sm font-medium text-primary-600 hover:underline" href="/login">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordVerify;
