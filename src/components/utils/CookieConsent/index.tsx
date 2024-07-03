'use client';

import PrimaryButton from '@/components/utils/PrimaryButton';
import config from '@/config';
import useIsMobile from '@/hooks/useIsMobile';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const consent = localStorage.getItem(config.localStorage.consent);
    if (!consent) setVisible(true);
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(config.localStorage.consent, 'yes');
    setVisible(false);
  };

  const position = isMobile ? -160 : -80;

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
              🍪 Usamos cookies essenciais para garantir que o AntiRecurso funcione corretamente.{' '}
              <Link
                href="/cookie-policy"
                className="text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
                tabIndex={1}>
                Sabe mais aqui.
              </Link>
            </p>
          </div>
          <div className="max-md:w-full">
            <PrimaryButton onClick={handleConfirm} className="max-md:w-full" tabIndex={2}>
              Confirmar
            </PrimaryButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
