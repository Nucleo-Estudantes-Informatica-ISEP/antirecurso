import { cookies } from 'next/headers';
import Link from 'next/link';
import config from 'src/config';
import HamburgerMenu from '../HamburgerMenu';
import PrimaryButton from '../PrimaryButton';

const Topbar: React.FC = () => {
  const cookieStore = cookies().get(config.cookies.token) as
    | { name: string; value: string }
    | undefined;
  const token = cookieStore?.value;

  return (
    <div className="w-screen h-20 flex items-center justify-between py-5 px-10 bg-white shadow border-gray-100 sticky top-0 left-0 z-20">
      <Link href="/" className="w-32 md:w-48">
        <img src="/images/logo.png" alt="Our beautiful logo" className="w-full" />
      </Link>
      <div className="hidden md:flex md:items-center">
        <div className="space-x-10">
          <Link href="/" className="hover:text-primary transition ease-in-out">
            Home
          </Link>
          <Link href="/exams" className="hover:text-primary transition ease-in-out">
            Exames
          </Link>
          <Link href="/scoreboard" className="hover:text-primary transition ease-in-out">
            Scoreboard
          </Link>
          <Link href="/documents" className="hover:text-primary transition ease-in-out">
            Documentos
          </Link>
        </div>
        <div className="ml-5">
          {token ? (
            <form action={`/profile/${token}`}>
              <PrimaryButton>Aceder ao perfil</PrimaryButton>
            </form>
          ) : (
            <form action="/register">
              <PrimaryButton>Criar uma conta</PrimaryButton>
            </form>
          )}
        </div>
      </div>
      <HamburgerMenu token={token} />
    </div>
  );
};

export default Topbar;
