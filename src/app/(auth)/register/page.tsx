'use client';
import { FormEvent, FormEventHandler, useEffect, useRef, useState } from 'react';

import Link from 'next/link';

import { z } from 'zod';

import RegisterSchema from 'src/schemas/RegisterSchema';

import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Spinner } from '@/styles/Icons';
import { useRouter } from 'next/navigation';
import swal from 'sweetalert';

const register: React.FC = () => {
  const router = useRouter();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationInputRef = useRef<HTMLInputElement>(null);

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
        router.push('/');
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
          'error'
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
    <div className="flex items-center justify-center py-12 px-4 sm:p-12 md:w-1/2 md:h-screen">
      <div className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-700">Criar conta</h1>

        <form onSubmit={handleSubmit}>
          <div className="mt-1">
            <InputLabel htmlFor="name" value="Nome" />
            <TextInput
              disabled={isSubmitting}
              type="text"
              inputRef={nameInputRef}
              className="block w-full"
              errorText={errors.name}
              tabIndex={0}
            />
          </div>

          <div className="mt-1">
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
              inputRef={emailInputRef}
              disabled={isSubmitting}
              className="block w-full"
              errorText={errors.email}
            />
          </div>

          <div className="mt-1">
            <InputLabel htmlFor="password" value="Password" />
            <TextInput
              inputRef={passwordInputRef}
              disabled={isSubmitting}
              errorText={errors.password}
              type="password"
              className="block w-full"
            />
          </div>

          <div className="mt-1">
            <InputLabel htmlFor="password_confirmation" value="Confirmar Password" />
            <TextInput
              inputRef={passwordConfirmationInputRef}
              disabled={isSubmitting}
              errorText={errors.password_confirmation}
              type="password"
              className="block w-full"
            />
          </div>

          <div className="mt-6">
            <PrimaryButton disabled={isSubmitting} type="submit" className="block w-full">
              {isSubmitting ? (
                <div className="flex flex-row justify-center items-center">
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

        <hr className="my-5" />

        <p className="mt-2">
          <Link className="text-sm font-medium text-primary-600 hover:underline" href="/login">
            Já tens uma conta?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default register;
