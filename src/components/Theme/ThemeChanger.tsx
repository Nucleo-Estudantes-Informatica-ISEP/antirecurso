'use client';

import { useTheme } from 'next-themes';
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();

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
