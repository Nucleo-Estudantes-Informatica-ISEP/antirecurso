'use client';

import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Spinner } from '@/styles/Icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LoginSchema from 'src/schemas/LoginSchema';
import swal from 'sweetalert';
import { z } from 'zod';

const Login: React.FC = () => {
  const router = useRouter();

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

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
        router.push('/');
      } else {
        swal(
          'Oops!',
          'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.',
          'error'
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
    <div className="flex items-center justify-center py-12 px-4 sm:p-12 md:w-1/2 max-w-md md:h-screen">
      <div className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-700">Entrar</h1>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
              inputRef={emailInputRef}
              disabled={isSubmitting}
              className="block w-full"
              errorText={errors.email}
            />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password" value="Password" />
            <TextInput
              inputRef={passwordInputRef}
              disabled={isSubmitting}
              errorText={errors.password}
              type="password"
              className="block w-full"
            />
          </div>

          <div className="flex mt-8 text-sm">
            <label className="flex items-center dark:text-gray-400">
              <input
                type="checkbox"
                name="remember"
                className="text-primary form-checkbox focus:border-primary focus:outline-none focus:shadow-outline-primary"
              />
              <span className="ml-2">Lembrar-me</span>
            </label>
          </div>

          <div className="mt-4">
            <PrimaryButton disabled={isSubmitting} type="submit" className="block w-full">
              {isSubmitting ? (
                <div className="flex flex-row justify-center items-center">
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
            Ainda não tens uma conta?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
