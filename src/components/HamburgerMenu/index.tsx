'use client';

import { Menu } from '@/styles/Icons';
import Link from 'next/link';
import { useState } from 'react';
import PrimaryButton from '../PrimaryButton';

interface HamburgerMenuProps {
  token: string | undefined;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex md:hidden">
      <Menu className="text-primary hover:cursor-pointer" onClick={handleClickMenu} />
      {isOpen && (
        <div className="absolute left-0 top-20 w-screen bg-white h-auto p-5 border border-gray-100 shadow rounded flex flex-col space-y-5">
          <Link href="/" className="hover:text-primary transition ease-in-out">
            Home
          </Link>
          <Link href="/exams" className="hover:text-primary transition ease-in-out">
            Exames
          </Link>
          <Link href="/scoreboard" className="hover:text-primary transition ease-in-out">
            Scoreboard
          </Link>
          <Link href="/about" className="hover:text-primary transition ease-in-out">
            About
          </Link>

          <div className="mt-5">
            {token ? (
              <form action={`/profile/${token}`}>
                <PrimaryButton className="w-full">Aceder ao perfil</PrimaryButton>
              </form>
            ) : (
              <form action="/register">
                <PrimaryButton className="w-full">Criar uma conta</PrimaryButton>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
