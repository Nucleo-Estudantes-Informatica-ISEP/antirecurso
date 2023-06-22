'use client';

import { Menu } from '@/styles/Icons';
import { useState } from 'react';
import HamburgerProfileMenu from '../HamburguerProfileMenu';
import TopbarLinks from '../TopbarLinks';

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
          <TopbarLinks />

          <div className="mt-5">
            <HamburgerProfileMenu token={token} isMobile={true} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;
