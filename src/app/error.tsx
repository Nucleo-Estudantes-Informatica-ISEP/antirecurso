'use client'; // Error components must be Client components

import PrimaryButton from '@/components/PrimaryButton';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-4xl">
        <span className="text-primary">Oops...</span> Something went{' '}
        <span className="text-primary">wrong!</span>
      </h1>
      <PrimaryButton className="text-lg" onClick={() => reset()}>
        Try again
      </PrimaryButton>
    </div>
  );
}
