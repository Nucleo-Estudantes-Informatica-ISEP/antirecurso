'use client';

import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { BASE_URL } from '@/services/api';
import { Spinner } from '@/styles/Icons';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import LoginSchema from 'src/schemas/LoginSchema';
import swal from 'sweetalert';

import { z } from 'zod';

const Confirm: React.FC = () => {
  const router = useRouter();

  const codeInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // const res = await fetch(`${BASE_URL}/auth/confirm-account`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password
      //   })
      // });
    } catch (err) {}
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-11/12 max-w-md px-4 py-12 sm:p-12 md:w-1/2 h-full">
      <div className="w-full dark:text-white">
        <h1 className="mb-4 text-xl font-semibold">Verificar conta</h1>

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <InputLabel
              htmlFor="code"
              value="Insere o código que recebeste no email para verificares a tua conta"
            />
            <TextInput inputRef={codeInputRef} disabled={isSubmitting} className="block w-full" />
          </div>

          <div className="mt-4">
            <PrimaryButton disabled={isSubmitting} type="submit" className="block w-full">
              {isSubmitting ? (
                <div className="flex flex-row items-center justify-center">
                  <svg className="animate-spin h-[16px] w-[16px] mr-3">
                    <Spinner size={16} />
                  </svg>
                  A verificar...
                </div>
              ) : (
                <span>Confirmar</span>
              )}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Confirm;
