import { Suspense } from 'react';
import AuthRedirect from '@/components/AuthRedirect';

export default function Page() {
  const issuer = process.env.AUTH_ISSUER_URL;
  const helpUrl = issuer ? new URL('/ui/v2/login/help', issuer).href : undefined;
  return (
    <Suspense>
      <AuthRedirect helpUrl={helpUrl} />
    </Suspense>
  );
}
