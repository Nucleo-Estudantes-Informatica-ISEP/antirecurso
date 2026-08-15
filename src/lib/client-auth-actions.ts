'use client';

import { signIn, signOut } from 'next-auth/react';

export async function signOutFromApp(callbackUrl = '/') {
  await signOut({ redirect: false });
  window.location.href = callbackUrl;
}

export async function switchAuthNeiAccount(callbackUrl = '/') {
  await signOut({ redirect: false });
  await signIn('zitadel', { callbackUrl }, { prompt: 'select_account' });
}
