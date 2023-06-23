import { cookies } from 'next/headers';
import Link from 'next/link';
import config from 'src/config';
import HamburgerMenu from '../HamburgerMenu';
import HamburgerProfileMenu from '../HamburguerProfileMenu';
import TopbarLink from '../TopbarLink';

const Topbar: React.FC = () => {
  const cookieStore = cookies().get(config.cookies.token) as { value: string } | undefined;
  const token = cookieStore?.value;

  return (
    <div className="w-screen h-20 flex items-center justify-between py-5 px-10 bg-white shadow border-gray-100 sticky top-0 left-0 z-20">
      <Link href="/" className="w-32 md:w-48">
        <img src="/images/logo.png" alt="Our beautiful logo" className="w-full" />
      </Link>
      <div className="hidden md:flex md:items-center">
        <div className="space-x-5">
          <TopbarLink href="/">Home</TopbarLink>
          <TopbarLink href="/exams">Exams</TopbarLink>
          <TopbarLink href="/scoreboard">Scoreboard</TopbarLink>
          <TopbarLink href="/about">About</TopbarLink>
        </div>

        <div className="ml-6">
          <HamburgerProfileMenu token={token ? token : null} />
        </div>
      </div>
      <HamburgerMenu token={token} />
    </div>
  );
};

export default Topbar;
