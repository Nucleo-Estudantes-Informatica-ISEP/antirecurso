'use client'; // Error components must be Client components

import PrimaryButton from '@/components/utils/PrimaryButton';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">
        <span className="text-primary">Oops...</span> Something went{' '}
        <span className="text-primary">wrong!</span>
      </h1>
      <PrimaryButton className="text-lg" onClick={() => reset()}>
        Try again
      </PrimaryButton>
    </div>
  );
}
