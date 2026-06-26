'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

interface ExamNumerationProps {
  wasAnswered?: boolean;
  active?: boolean;
  isWrong?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  align: 'start' | 'end' | 'center';
}

const ExamNumeration: React.FC<ExamNumerationProps> = ({
  wasAnswered,
  active,
  onClick,
  isWrong,
  children,
  align
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (active && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: align
      });
    }
  }, [active, align]);

  return (
    <motion.button
      animate={{
        opacity: [0, 1],
        scale: active ? 1.05 : 1
      }}
      transition={{ duration: 0.2 }}
      ref={ref}
      onClick={onClick}
      className={cn(
        'shrink-0 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all',
        'border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary',
        wasAnswered && !active && 'border-primary/40 bg-primary/15 text-primary',
        isWrong && !active && 'border-destructive bg-destructive/15 text-destructive',
        active &&
          'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:text-primary-foreground hover:border-primary'
      )}
    >
      {children}
    </motion.button>
  );
};

export default ExamNumeration;
