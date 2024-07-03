'use client';

import InputLabel from '@/components/utils/InputLabel';
import PrimaryButton from '@/components/utils/PrimaryButton';
import TextInput from '@/components/utils/TextInput';
import { ResetPasswordContext } from '@/contexts/ResetPasswordContext';
import VerifyPasswordSchema from '@/schemas/VerifyPasswordSchema';
import { Spinner } from '@/styles/Icons';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useRef, useState } from 'react';

import { z } from 'zod';

const Verify: React.FC = () => {
  const router = useRouter();

  const searchParams = useSearchParams();

  const { setCode, setEmail } = useContext(ResetPasswordContext);

  const codeInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    code?: string;
  }>({});

  function clearErrors() {
    setErrors({
      code: undefined
    });
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      code: codeInputRef.current?.value
    };

    try {
      const result = VerifyPasswordSchema.parse(data);
      setIsSubmitting(true);
      clearErrors();

      const { code } = result;

      setCode(code);

      router.push('/reset-password/new');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errs = err.formErrors.fieldErrors;

        setErrors({
          code: errs.code?.flat()[0]
        });
      }
    }
  };

  useEffect(() => {
    if (errors.code) codeInputRef.current?.focus();
  }, [errors]);

  useEffect(() => {
    const email = searchParams.get('email');
    setEmail(email);
  }, [searchParams, setEmail]);

  return (
    <div className="relative flex flex-col items-center justify-center w-11/12 max-w-md px-4 py-12 sm:p-12 md:w-1/2 h-full">
      <div className="w-full dark:text-white -mt-8 md:mt-0">
        <h1 className="mb-12 text-2xl font-semibold">Perdeste a tua password?</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <InputLabel htmlFor="code" value="Código" />
            <TextInput
              placeholder="Código de verificação"
              inputRef={codeInputRef}
              disabled={isSubmitting}
              className="block w-full"
              errorText={errors.code}
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
                <span>Verificar</span>
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
