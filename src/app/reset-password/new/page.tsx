'use client';

import InputLabel from '@/components/utils/InputLabel';
import PrimaryButton from '@/components/utils/PrimaryButton';
import TextInput from '@/components/utils/TextInput';
import { ResetPasswordContext } from '@/contexts/ResetPasswordContext';
import { Spinner } from '@/styles/Icons';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';
import swal from 'sweetalert';

import { z } from 'zod';

const Verify: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();

  const { code, email } = useContext(ResetPasswordContext);

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    password?: string;
  }>({});

  function clearErrors() {
    setErrors({
      password: undefined
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      password: passwordInputRef.current?.value
    };

    try {
      const result = z
        .object({
          password: z.string().min(8, 'A password deve ter pelo menos 8 caracteres.')
        })
        .parse(data);
      setIsSubmitting(true);
      clearErrors();

      const { password } = result;

      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password,
          code
        })
      });

      if (res.status === 200) {
        swal(
          'Sucesso!',
          'A tua password foi alterada com sucesso. Agora podes fazer login com a tua nova password.',
          'success',
          {
            className: theme === 'dark' ? 'swal-dark' : ''
          }
        );
        router.push('/');
        router.refresh();
      } else {
        swal(
          'Oops!',
          'Ocorreu um erro ao alterar a tua password. Por favor tenta novamente.',
          'error',
          {
            className: theme === 'dark' ? 'swal-dark' : ''
          }
        );

        setIsSubmitting(false);

        passwordInputRef.current?.focus();
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errs = err.formErrors.fieldErrors;

        setErrors({
          password: errs.code?.flat()[0]
        });
      }
    }
  };

  useEffect(() => {
    if (errors.password) passwordInputRef.current?.focus();
  }, [errors]);

  return (
    <div className="relative flex flex-col items-center justify-center w-11/12 max-w-md px-4 py-12 sm:p-12 md:w-1/2 h-full">
      <div className="w-full dark:text-white -mt-8 md:mt-0">
        <h1 className="mb-12 text-2xl font-semibold">Altera a tua password</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <InputLabel htmlFor="password" value="Password" />
            <TextInput
              placeholder="Nova Password"
              inputRef={passwordInputRef}
              disabled={isSubmitting}
              className="block w-full"
              errorText={errors.password}
              type="password"
            />
          </div>

          <div>
            <PrimaryButton disabled={isSubmitting} type="submit" className="block w-full">
              {isSubmitting ? (
                <div className="flex flex-row items-center justify-center">
                  <svg className="animate-spin h-[16px] w-[16px] mr-3">
                    <Spinner size={16} />
                  </svg>
                  A verificar...
                </div>
              ) : (
                <span>Alterar</span>
              )}
            </PrimaryButton>
          </div>
        </form>

        <hr className="my-8" />

        <p className="mt-4">
          <Link className="text-sm font-medium text-primary-600 hover:underline" href="/login">
            Já tens uma conta?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Verify;
