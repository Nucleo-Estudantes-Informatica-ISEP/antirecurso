'use client';
import { FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { z } from 'zod';

import RegisterSchema from 'src/schemas/RegisterSchema';

import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Spinner } from '@/styles/Icons';
import { useTheme } from 'next-themes';
import { useRouter, useSearchParams } from 'next/navigation';
import swal from 'sweetalert';
import useSession from '@/hooks/useSession';

const Register: React.FC = () => {
  const callbackUrl = useSearchParams().get('callbackUrl');
  const session = useSession();
  const router = useRouter();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationInputRef = useRef<HTMLInputElement>(null);

  const { theme } = useTheme();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
  }>({});

  function clearErrors() {
    setErrors({
      name: undefined,
      email: undefined,
      password: undefined,
      password_confirmation: undefined
    });
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event: FormEvent) => {
    event.preventDefault();

    const data = {
      name: nameInputRef.current?.value,
      email: emailInputRef.current?.value,
      password: passwordInputRef.current?.value,
      password_confirmation: passwordConfirmationInputRef.current?.value
    };

    try {
      const result = RegisterSchema.parse(data);
      setIsSubmitting(true);
      clearErrors();

      const { name, email, password } = result;

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password
        })
      });

      if (res.status === 200) {
        session.revalidate();
        router.push(decodeURI(callbackUrl ?? '/'));
        router.refresh();
      } else if (res.status === 422) {
        // duplicate email
        const { message } = await res.json();

        setErrors({
          email: message
        });
      } else {
        swal(
          'Erro',
          'Ocorreu um erro ao tentar registar a conta, por favor tente novamente',
          'error',
          {
            className: theme === 'dark' ? 'swal-dark' : ''
          }
        );
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errs = err.formErrors.fieldErrors;

        setErrors({
          name: errs.name?.flat()[0],
          email: errs.email?.flat()[0],
          password: errs.password?.flat()[0],
          password_confirmation: errs.password_confirmation?.flat()[0]
        });
      }
    }
  };

  useEffect(() => {
    if (errors.name) nameInputRef.current?.focus();
    else if (errors.email) emailInputRef.current?.focus();
    else if (errors.password) passwordInputRef.current?.focus();
    else if (errors.password_confirmation) passwordConfirmationInputRef.current?.focus();
  }, [errors]);

  return (
    <div className="relative flex flex-col items-center justify-center w-11/12 max-w-md px-4 py-12 sm:p-12 md:w-1/2 h-full">
      <div className="w-full dark:text-white">
        <h1 className="mb-12 text-2xl font-semibold">Bem-vindo ao AntiRecurso!</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <InputLabel htmlFor="name" value="Nome" />
            <TextInput
              placeholder="Nome"
              disabled={isSubmitting}
              type="text"
              inputRef={nameInputRef}
              className="block w-full"
              errorText={errors.name}
              tabIndex={0}
            />
          </div>

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

          <div>
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
            <InputLabel htmlFor="password_confirmation" value="Confirmar Password" />
            <TextInput
              placeholder="Repete a Password"
              inputRef={passwordConfirmationInputRef}
              disabled={isSubmitting}
              errorText={errors.password_confirmation}
              type="password"
              className="block w-full"
            />
          </div>

          <div className="flex items-center mt-8 text-sm">
            <label className="flex items-center dark:text-gray-400">
              <input
                type="checkbox"
                name="privacy-policy"
                required
                className="text-primary form-checkbox focus:border-primary focus:outline-none focus:shadow-outline-primary"
              />
              <span className="ml-2 dark:text-white">
                Confirmo que li e aceito a{' '}
                <Link
                  target="_blank"
                  className="text-primary hover:underline"
                  href="/privacy-policy">
                  Política de Privacidade
                </Link>
              </span>
            </label>
          </div>

          <div className="mt-6">
            <PrimaryButton disabled={isSubmitting} type="submit" className="block w-full">
              {isSubmitting ? (
                <div className="flex flex-row items-center justify-center">
                  <svg className="animate-spin h-[16px] w-[16px] mr-3">
                    <Spinner size={16} />
                  </svg>
                  A registar...
                </div>
              ) : (
                <span>Registar</span>
              )}
            </PrimaryButton>
          </div>
        </form>

        <hr className="my-8" />

        <p className="mt-4">
          <Link
            className="text-sm font-medium text-primary-600 hover:underline"
            href={'/login?callbackUrl=' + callbackUrl ?? '/'}>
            Já tens conta?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
