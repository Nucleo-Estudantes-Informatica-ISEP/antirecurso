'use client';

import PrimaryButton from '@/components/PrimaryButton';
import config from '@/config';
import useIsMobile from '@/hooks/useIsMobile';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ChangelogPopUp: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  const localStorageKeyName = `config.localStorage.changelog-${config.version}`;

  useEffect(() => {
    const hasSeenChangelog = localStorage.getItem(localStorageKeyName);
    if (!hasSeenChangelog) setVisible(true);
  }, [localStorageKeyName]);

  const handleConfirm = () => {
    localStorage.setItem(localStorageKeyName, 'yes');
    setVisible(false);
  };

  const position = isMobile ? -160 : -80;
  const version = config.version;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed -bottom-40 md:-bottom-20 left-0 w-full px-8 py-4 bg-white dark:bg-secondary-dark shadow-black shadow-lg border-t-gray-100 flex flex-col md:flex-row items-center justify-between gap-4"
          animate={{ y: [0, position] }}
          exit={{ y: [position, 0] }}
          transition={{ duration: 0.3, ease: 'easeOut' }}>
          <div>
            <p className="font-medium">
              A versão {version} está aqui 🎉. Descobre mais{' '}
              <Link
                href="/changelog"
                onClick={handleConfirm}
                className="text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
                tabIndex={1}>
                aqui.
              </Link>
            </p>
          </div>
          <div className="max-md:w-full">
            <PrimaryButton onClick={handleConfirm} className="max-md:w-full" tabIndex={2}>
              Ignorar
            </PrimaryButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangelogPopUp;
