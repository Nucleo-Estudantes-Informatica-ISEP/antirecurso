'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import PrimaryButton from '@/components/PrimaryButton';
import config from '@/config';

const CookieConsent: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(config.localStorage.consent);
    if (!consent) setVisible(true);
  }, []);

  const handleConfirm = () => {
    localStorage.setItem(config.localStorage.consent, 'yes');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed -bottom-20 left-0 w-full px-8 py-4 bg-white text-black shadow-black shadow-lg border-t flex flex-col md:flex-row items-center justify-between gap-4"
          animate={{ y: [0, -80] }}
          exit={{ y: [-80, 0] }}
          transition={{ duration: 0.3, ease: 'easeOut' }}>
          <div>
            <p className="font-medium">
              Usamos cookies essenciais para garantir que o Antirecurso funcione corretamente.{' '}
              <Link
                href="/cookie-policy"
                className="text-blue-700 hover:underline cursor-pointer"
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
