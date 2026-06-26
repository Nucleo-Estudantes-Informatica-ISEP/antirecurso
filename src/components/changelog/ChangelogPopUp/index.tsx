'use client';

import { Button } from '@/components/ui/button';
import config from '@/config';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const ChangelogPopUp: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const localStorageKeyName = `${config.localStorage.changelog}-${config.version}`;

  useEffect(() => {
    const hasSeenChangelog = localStorage.getItem(localStorageKeyName);
    if (!hasSeenChangelog) setVisible(true);
  }, [localStorageKeyName]);

  const handleConfirm = () => {
    localStorage.setItem(localStorageKeyName, 'yes');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-x-0 bottom-4 z-40 px-4"
        >
          <div className="mx-auto max-w-3xl rounded-2xl border bg-card/95 backdrop-blur shadow-xl p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
                <Sparkles className="size-5" />
              </div>
              <p className="text-sm leading-6">
                A versão <span className="font-semibold text-primary">{config.version}</span> está
                aqui! Descobre as novidades{' '}
                <Link
                  href="/changelog"
                  onClick={handleConfirm}
                  className="text-primary font-medium hover:underline"
                  tabIndex={1}
                >
                  aqui
                </Link>
                .
              </p>
            </div>
            <Button
              onClick={handleConfirm}
              variant="outline"
              className="w-full md:w-auto"
              tabIndex={2}
            >
              Ignorar
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChangelogPopUp;
