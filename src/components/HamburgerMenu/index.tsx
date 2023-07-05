'use client';

import { Menu } from '@/styles/Icons';
import Link from 'next/link';
import { useState } from 'react';
import LogoutButton from '../LogoutButton';
import PrimaryButton from '../PrimaryButton';
import ThemeChanger from '../Theme/ThemeChanger';
import TopbarLink from '../TopbarLink';

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
        <div className="absolute left-0 flex flex-col w-screen h-auto p-5 space-y-5 bg-white shadow dark:shadow-secondary-dark top-20 dark:bg-secondary-dark z-15">
          <div className="self-end">
            <ThemeChanger />
          </div>

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

          <div className="flex flex-col pt-6 mt-6 border-t border-gray-200 gap-y-4">
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
                <Link href={`/login`} onClick={closeMenu}>
                  <PrimaryButton className="w-full">Entrar numa conta</PrimaryButton>
                </Link>
                <Link
                  href={`/register`}
                  onClick={closeMenu}
                  className="flex items-center justify-center">
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
