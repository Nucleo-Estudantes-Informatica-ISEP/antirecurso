'use client';

import useSession from '@/hooks/useSession';
import { Menu, X } from '@/styles/Icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LogoutButton from '../LogoutButton';
import PrimaryButton from '../PrimaryButton';

const HamburgerProfileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const session = useSession();

  const handleClickMenu = () => {
    setIsOpen((prev) => !prev);
  };

  function closeMenu() {
    setIsOpen(false);
  }

  useEffect(() => {
    if (isOpen) document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  });

  return (
    <div className="flex">
      {isOpen ? (
        <div>
          <X className="w-5 h-5 text-primary hover:cursor-pointer" onClick={handleClickMenu} />
          <div className="absolute right-0 w-64 bg-white rounded-b-lg dark:bg-primary-dark top-20">
            <div className="flex flex-col p-4 mb-1 gap-y-2">
              {session.user ? (
                <>
                  <Link href={`/profile`}>
                    <PrimaryButton onClick={closeMenu} className="w-full mb-2">
                      Aceder ao perfil
                    </PrimaryButton>
                  </Link>
                  <LogoutButton onClick={closeMenu} />
                </>
              ) : (
                <>
                  <Link href="/login">
                    <PrimaryButton onClick={closeMenu} className="w-full">
                      Iniciar sessão
                    </PrimaryButton>
                  </Link>
                  <Link href="/register">
                    <PrimaryButton onClick={closeMenu} className="w-full">
                      Criar uma conta
                    </PrimaryButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Menu className="w-5 h-5 text-primary hover:cursor-pointer" onClick={handleClickMenu} />
      )}
    </div>
  );
};

export default HamburgerProfileMenu;
