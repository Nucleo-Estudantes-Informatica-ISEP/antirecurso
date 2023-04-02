import Link from 'next/link';

import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';

const register: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
      <div className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-700">Criar conta</h1>

        <form method="POST" action="/register">
          <div className="mt-4">
            <InputLabel htmlFor="name" value="Nome" />
            <TextInput
              type="text"
              id="name"
              name="name"
              className="block w-full"
              value="{{ old('name') }}"
              required
              tabIndex={0}
            />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="email" value="Email" />
            <TextInput
              name="email"
              type="email"
              className="block w-full"
              value="{{ old('email') }}"
            />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password" value="Password" />
            <TextInput type="password" name="password" className="block w-full" required />
          </div>

          <div className="mt-4">
            <InputLabel
              htmlFor="password_confirmation"
              id="password_confirmation"
              value="Confirmar Password"
            />
            <TextInput
              type="password"
              name="password_confirmation"
              className="block w-full"
              required
            />
          </div>

          <div className="mt-4">
            <PrimaryButton className="block w-full">Registar</PrimaryButton>
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

export default register;
