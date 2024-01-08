'use client';

import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import useSession from '@/hooks/useSession';
import { Spinner } from '@/styles/Icons';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LoginSchema from 'src/schemas/LoginSchema';
import swal from 'sweetalert';

import { z } from 'zod';

const Login: React.FC = () => {
  const session = useSession();
  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function clearErrors() {
    setErrors({
      email: undefined,
      password: undefined
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      email: emailInputRef.current?.value,
      password: passwordInputRef.current?.value
    };

    try {
      const result = LoginSchema.parse(data);
      setIsSubmitting(true);
      clearErrors();

      const { email, password } = result;

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (res.status === 200) {
        session.revalidate();
        router.push('/');
        router.refresh();
      } else {
        swal(
          'Oops!',
          'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.',
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
          email: errs.email?.flat()[0],
          password: errs.password?.flat()[0]
        });
      }
    }
  };

  useEffect(() => {
    if (errors.email) emailInputRef.current?.focus();
    else if (errors.password) passwordInputRef.current?.focus();
  }, [errors]);

  return (
    <div className="relative flex flex-col items-center justify-center w-11/12 max-w-md px-4 py-12 sm:p-12 md:w-1/2 h-full">
      <div className="w-full dark:text-white -mt-8 md:mt-0">
        <h1 className="mb-12 text-2xl font-semibold">Bem-vindo!</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
              placeholder="Email"
              inputRef={emailInputRef}
              disabled={isSubmitting}
              className="block w-full"
              errorText={errors.email}
            />
          </div>

          <div className="mb-4">
            <InputLabel htmlFor="password" value="Password" />
            <TextInput
              placeholder="Password"
              inputRef={passwordInputRef}
              disabled={isSubmitting}
              errorText={errors.password}
              type="password"
              className="block w-full"
            />
          </div>

          <div>
            <PrimaryButton disabled={isSubmitting} type="submit" className="block w-full">
              {isSubmitting ? (
                <div className="flex flex-row items-center justify-center">
                  <svg className="animate-spin h-[16px] w-[16px] mr-3">
                    <Spinner size={16} />
                  </svg>
                  A autenticar...
                </div>
              ) : (
                <span>Entrar</span>
              )}
            </PrimaryButton>
          </div>
        </form>

        <hr className="my-8" />

        <p className="mt-4">
          <Link className="text-sm font-medium text-primary-600 hover:underline" href="/register">
            Ainda não tens conta?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
