import DarkMainLogo from '@/images/logos/main-logo-dark.svg';
import MainLogo from '@/images/logos/main-logo.svg';
import Image from 'next/image';
import Link from 'next/link';
import HamburgerMenu from '../HamburgerMenu';
import HamburgerProfileMenu from '../HamburguerProfileMenu';
import TopbarLink from '../TopbarLink';
import ThemeChanger from '../Theme/ThemeChanger';

export const topBarLinks = {
  Home: '/',
  Exames: '/exams',
  Scoreboard: '/scoreboard',
  Resumos: '/notes',
  Sobre: '/about'
};

const Topbar: React.FC = () => {
  return (
    <nav className="sticky top-0 left-0 z-30 flex items-center justify-between w-screen h-20 px-10 py-5 bg-white border-gray-100 shadow dark:shadow-secondary-dark dark:bg-secondary-dark">
      <Link href="/" className="dark:hidden max-w-[8rem] md:max-w-[12rem] ">
        <Image height={192} width={192} priority src={MainLogo} alt="AntiRecurso Light Logo" />
      </Link>
      <Link href="/" className="hidden dark:block max-w-[8rem] md:max-w-[12rem]">
        <Image
          height={192}
          width={192}
          priority
          src={DarkMainLogo}
          alt="AntiRecurso Dark Logo"
          className="w-full"
        />
      </Link>

      <div className="hidden md:flex md:items-center">
        <div className="flex items-center gap-x-5">
          {Object.entries(topBarLinks).map(([label, href], index) => (
            <TopbarLink key={index} href={href}>
              {label}
            </TopbarLink>
          ))}
          <ThemeChanger />
        </div>

        <div className="ml-6">
          <HamburgerProfileMenu />
        </div>
      </div>
      <HamburgerMenu />
    </nav>
  );
};

export default Topbar;
