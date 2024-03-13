'use client';

import { Flag, Home, LeftArrow, Message, Note, RightArrow, User } from '@/styles/Icons';
import Link from 'next/link';
import { useState } from 'react';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const items = [
    { label: 'Dashboard', icon: <Home className="text-lg" />, link: '/admin' },
    { label: 'Example', icon: null, link: null },
    { label: 'Utilizadores', icon: <User className="text-lg" />, link: '/admin/users' },
    { label: 'Resumos', icon: <Note className="text-lg" />, link: '/admin/notes' },
    { label: 'Example', icon: null, link: null },
    { label: 'Reports', icon: <Flag className="text-lg" />, link: '/admin/question-reports' },
    { label: 'Comentários', icon: <Message className="text-lg" />, link: '/admin/comments' }
  ];

  return (
    <>
      <nav
        className={`${
          !isOpen && 'max-md:hidden'
        } fixed w-64 left-0 top-20 bottom-0 overflow-y-scroll z-20 shadow-md bg-white dark:bg-secondary-dark`}>
        <ul className="mb-12">
          <li className="mt-4 mb-2 font-bold dark:text-gray-300">
            <div className="px-4 flex flex-1 items-center justify-between">
              <span>Menu</span>
            </div>
          </li>

          {items.map((item, k) => (
            <li
              key={k}
              className={`${
                !item.link ? 'mt-4 mb-2 font-bold' : 'flex flex-row items-center'
              } dark:text-gray-300`}>
              {item.link ? (
                <Link
                  href={item.link}
                  className="flex flex-row items-center gap-4 w-full p-4 hover:bg-gray-200 dark:hover:text-white dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}>
                  {item.icon}
                  {item.label}
                </Link>
              ) : (
                <div className="px-4">
                  <span>{item.label}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div
        className={`${
          isOpen ? 'fixed' : 'hidden'
        } md:hidden top-20 bottom-0 left-0 right-0 bg-black/50 z-10 transition-opacity`}
        onClick={() => setIsOpen(false)}></div>

      <button
        className="absolute left-4 bottom-4 rounded-full p-4 shadow-md bg-white hover:bg-gray-200 dark:bg-primary-dark dark:hover:bg-gray-700 cursor-pointer md:hidden z-20 transition-colors"
        onClick={() => setIsOpen((o) => !o)}>
        {isOpen ? <LeftArrow /> : <RightArrow />}
      </button>
    </>
  );
};

export default Sidebar;
