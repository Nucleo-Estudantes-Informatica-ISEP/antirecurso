'use client';

import { useTheme } from 'next-themes';
import { BsFillSunFill, BsMoonStarsFill } from 'react-icons/bs';

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();

  return (
    <button className="fixed z-40 flex items-center justify-center w-10 h-10 text-gray-900 bg-gray-100 rounded-full bottom-5 right-5 dark:bg-gray-900 dark:text-yellow-400">
      {theme === 'light' ? (
        <BsMoonStarsFill onClick={() => setTheme('dark')} size={27} />
      ) : (
        <BsFillSunFill onClick={() => setTheme('light')} size={27} />
      )}
    </button>
  );
}
