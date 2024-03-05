'use client';

import { Flag, Home, LeftArrow, Message, Note, User } from '@/styles/Icons';
import Link from 'next/link';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
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
      <nav className="fixed w-64 -left-64 md:left-0 top-20 bottom-0 bg-secondary-dark overflow-y-scroll z-30">
        <ul className="mb-12">
          <li className="mt-4 mb-2 font-bold text-gray-300">
            <div className="px-4 flex flex-1 items-center justify-between">
              <span>Menu</span>
              <LeftArrow className="cursor-pointer" />
            </div>
          </li>

          {items.map((item, k) => (
            <li
              key={k}
              className={`${
                !item.link ? 'mt-4 mb-2 font-bold' : 'flex flex-row items-center'
              } text-gray-300`}>
              {item.link ? (
                <Link
                  href={item.link}
                  className="flex flex-row items-center gap-4 p-4 hover:text-white hover:bg-gray-700 transition-colors w-full">
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

      <div className="fixed md:hidden top-20 bottom-0 left-0 right-0 bg-black/50 z-10"></div>
    </>
  );
};

export default Sidebar;
