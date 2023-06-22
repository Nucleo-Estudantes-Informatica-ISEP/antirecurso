'use client';

import { Menu } from '@/styles/Icons';
import { useState } from 'react';
import PrimaryButton from '../PrimaryButton';
import LogoutButton from '../LogoutButton';

interface HamburgerProfileMenuProps {
  token: string | undefined;
  isMobile?: boolean;
}

const HamburgerProfileMenu: React.FC<HamburgerProfileMenuProps> = ({ token, isMobile }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickMenu = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="flex">
      <Menu className="text-primary hover:cursor-pointer" onClick={handleClickMenu} />
      {isOpen && (
        <div
          className={`absolute w-50 bg-white rounded shadow ${
            isMobile ? '-left-1 top-56' : 'right-0 top-20'
          }`}>
          <div className="p-2 space-y-2">
            {token ? (
              <>
                <form action={`/profile/${token}`}>
                  <PrimaryButton className="w-full">Aceder ao perfil</PrimaryButton>
                </form>
                <LogoutButton />
              </>
            ) : (
              <>
                <form action="/login">
                  <PrimaryButton className="w-full">Login</PrimaryButton>
                </form>
                <form action="/register">
                  <PrimaryButton className="w-full">Criar uma conta</PrimaryButton>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerProfileMenu;
