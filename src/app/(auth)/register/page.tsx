'use client';

import PrimaryButton from '@/components/utils/PrimaryButton';
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
        'Nao foi possivel abrir o portal de autenticacao. Por favor tenta novamente.',
        'error'
      );
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-11/12 max-w-md px-4 py-12 sm:p-12 md:w-1/2 h-full">
      <div className="w-full dark:text-white">
        <h1 className="mb-6 text-2xl font-semibold">Criar conta</h1>
        <p className="mb-8 text-sm leading-7 text-gray-600 dark:text-gray-300">
          O registo passou para o portal oficial de autenticacao do NEI. Continua no portal e cria
          la a tua conta para depois regressares automaticamente ao AntiRecurso.
        </p>

        <PrimaryButton type="button" className="block w-full" onClick={handleRegister}>
          Continuar para o portal
        </PrimaryButton>

        <hr className="my-8" />

        <p className="mt-4">
          <Link
            className="text-sm font-medium text-primary-600 hover:underline"
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
            Ja tens conta?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
