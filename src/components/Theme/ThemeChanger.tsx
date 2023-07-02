'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';

export default function ThemeChanger() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  // This to prevent the theme change from being rendered on the server
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Show default icons while loading from the server.
    return (
      <div className="flex items-center justify-center w-5 h-5 rounded-full text-primary dark:text-primary ">
        <BsMoonStarsFill className="dark:hidden" size={20} />
        <BsFillSunFill className="hidden dark:block" size={20} />
      </div>
    );
  }

  return (
    <button className="flex items-center justify-center w-5 h-5 transition-colors rounded-full text-primary hover:text-primary-dark dark:text-primary dark:hover:text-white">
      {theme === 'light' ? (
        <BsMoonStarsFill onClick={() => setTheme('dark')} size={20} />
      ) : (
        <BsFillSunFill onClick={() => setTheme('light')} size={20} />
      )}
    </button>
  );
}
