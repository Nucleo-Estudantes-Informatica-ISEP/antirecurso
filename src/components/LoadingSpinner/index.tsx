'use client';

import { SVGAttributes } from 'react';

import { LSpinner } from '@/styles/Icons';

const LoadingSpinner: React.FC<SVGAttributes<SVGElement>> = ({ className }) => {
  return <LSpinner className={`animate-spin ${className}`} />;
};

export default LoadingSpinner;
