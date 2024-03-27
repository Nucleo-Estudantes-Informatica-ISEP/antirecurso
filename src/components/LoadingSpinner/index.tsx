'use client';

import { useTheme } from 'next-themes';
import { SVGAttributes } from 'react';

import { LSpinner } from '@/styles/Icons';

const LoadingSpinner: React.FC<SVGAttributes<SVGElement>> = ({ className }) => {
  const { theme } = useTheme();

  return <LSpinner className={`animate-spin ${className}`} />;
};

export default LoadingSpinner;
