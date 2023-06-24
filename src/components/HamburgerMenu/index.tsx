'use client';

import { Menu } from '@/styles/Icons';
import { useState } from 'react';
import TopbarLink from '../TopbarLink';
import LogoutButton from '../LogoutButton';
import PrimaryButton from '../PrimaryButton';
import Link from 'next/link';

interface HamburgerMenuProps {
  token: string | undefined;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="flex md:hidden">
      <Menu className="text-primary hover:cursor-pointer" onClick={handleClickMenu} />
      {isOpen && (
        <div className="absolute left-0 top-20 w-screen bg-white h-auto p-5 border border-gray-100 shadow rounded flex flex-col space-y-5">
          <TopbarLink onClick={closeMenu} href="/">
            Home
          </TopbarLink>
          <TopbarLink onClick={closeMenu} href="/exams">
            Exames
          </TopbarLink>
          <TopbarLink onClick={closeMenu} href="/scoreboard">
            Scoreboard
          </TopbarLink>
          <TopbarLink onClick={closeMenu} href="/about">
            Sobre
          </TopbarLink>

          <div className="mt-6 border-t border-gray-200 pt-6 flex flex-col gap-y-4">
            {token ? (
              <>
                <Link href={`/profile/${token}`}>
                  <PrimaryButton onClick={closeMenu} className="w-full">
                    Aceder ao perfil
                  </PrimaryButton>
                </Link>
                <LogoutButton className="w-full" />
              </>
            ) : (
              <>
                <Link href={`/login`}>
                  <PrimaryButton className="w-full">Entrar numa conta</PrimaryButton>
                </Link>
                <Link href={`/register`} className="flex items-center justify-center">
                  <span>Criar uma conta</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
