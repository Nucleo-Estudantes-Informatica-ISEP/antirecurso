'use client';

import { Menu } from '@/styles/Icons';
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
          <form action="/" className="hover:text-primary transition ease-in-out text-start">
            <button className="w-ful">Home</button>
          </form>
          <form action="/exams" className="hover:text-primary transition ease-in-out">
            <button className="w-ful">Exames</button>
          </form>
          <form action="/scoreboard" className="hover:text-primary transition ease-in-out">
            <button className="w-ful">Scoreboard</button>
          </form>
          <form action="/about" className="hover:text-primary transition ease-in-out">
            <button className="w-ful">About</button>
          </form>

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
