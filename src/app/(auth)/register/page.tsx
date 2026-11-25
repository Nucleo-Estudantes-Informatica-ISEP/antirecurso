import { Suspense } from 'react';
import AuthRedirect from '@/components/AuthRedirect';

export default function Page() {
  return (
    <Suspense>
      <AuthRedirect register />
    </Suspense>
  );
}
