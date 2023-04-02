import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import Link from 'next/link';

const login: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
      <div className="w-full">
        <h1 className="mb-4 text-xl font-semibold text-gray-700">Entrar</h1>

        <form method="POST" action="{{ route('login') }}">
          <div className="mt-4">
            <InputLabel value="Email" />
            <TextInput
              type="email"
              id="email"
              name="email"
              value="{{ old('email') }}"
              className="block w-full"
              required
              tabIndex={0}
            />
          </div>

          <div className="mt-4">
            <InputLabel htmlFor="password" value="Password" />
            <TextInput type="password" id="password" name="password" className="block w-full" />
          </div>

          <div className="flex mt-6 text-sm">
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
            <PrimaryButton className="block w-full">Entrar</PrimaryButton>
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

export default login;
