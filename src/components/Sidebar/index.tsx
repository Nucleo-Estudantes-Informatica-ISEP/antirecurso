'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Flag, Home, Message, Note, RightArrow, User } from '@/styles/Icons';
import useIsMobile from '@/hooks/useIsMobile';

interface SidebarProps {
  children?: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 250);
  }, []);

  const items = [
    { label: 'Dashboard', icon: <Home className="text-lg" />, link: '/admin' },
    { label: 'Example', icon: null, link: null },
    { label: 'Utilizadores', icon: <User className="text-lg" />, link: '/admin/users' },
    { label: 'Resumos', icon: <Note className="text-lg" />, link: '/admin/notes' },
    { label: 'Example', icon: null, link: null },
    { label: 'Reports', icon: <Flag className="text-lg" />, link: '/admin/question-reports' },
    { label: 'Comentários', icon: <Message className="text-lg" />, link: '/admin/comments' }
  ];

  const navMotion = {
    open: { x: 0 },
    closed: { x: '-100%' }
  };

  const transition = {
    bounce: false,
    ease: 'easeOut',
    duration: 0.25
  };

  return (
    <>
      <motion.nav
        animate={isMobile && !isOpen ? 'closed' : 'open'}
        variants={navMotion}
        transition={transition}
        className={`${
          !isLoaded && 'max-md:hidden'
        } fixed w-64 md:left-0 top-20 bottom-0 overflow-y-scroll z-20 shadow-md bg-white dark:bg-secondary-dark`}>
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
                  onClick={() => setIsOpen(false)}
                  tabIndex={isMobile && !isOpen ? -1 : undefined}>
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
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="fixed md:hidden top-20 bottom-0 left-0 right-0 bg-black/50 z-10 transition-opacity"
            onClick={() => setIsOpen(false)}></motion.div>
        )}
      </AnimatePresence>

      <motion.button
        className="absolute left-4 bottom-4 rounded-full p-4 shadow-md bg-white hover:bg-gray-200 dark:bg-primary-dark dark:hover:bg-gray-700 cursor-pointer md:hidden z-20 transition-colors"
        onClick={() => setIsOpen((o) => !o)}
        animate={{ rotate: isOpen ? 180 : 0 }}>
        <RightArrow />
      </motion.button>
    </>
  );
};

export default Sidebar;
