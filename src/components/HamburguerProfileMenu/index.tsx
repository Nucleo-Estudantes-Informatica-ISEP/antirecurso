'use client';

import { Menu } from '@/styles/Icons';
import { useState } from 'react';
import PrimaryButton from '../PrimaryButton';
import LogoutButton from '../LogoutButton';
import Link from 'next/link';

interface HamburgerProfileMenuProps {
  token: string | null;
}

const HamburgerProfileMenu: React.FC<HamburgerProfileMenuProps> = ({ token }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickMenu = () => {
    setIsOpen((prev) => !prev);
  };

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="flex">
      <Menu className="text-primary hover:cursor-pointer" onClick={handleClickMenu} />
      {isOpen && (
        <div className="absolute w-64 bg-white right-0 rounded-b-lg top-20">
          <div className="flex flex-col p-2 gap-y-2 mb-1">
            {token ? (
              <>
                <Link href={`/profile/${token}`}>
                  <PrimaryButton className="w-full">Aceder ao perfil</PrimaryButton>
                </Link>
                <LogoutButton onClick={closeMenu} />
              </>
            ) : (
              <>
                <Link href="/login">
                  <PrimaryButton className="w-full">Entrar numa conta</PrimaryButton>
                </Link>
                <Link href="/register">
                  <PrimaryButton className="w-full">Criar uma conta</PrimaryButton>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerProfileMenu;
