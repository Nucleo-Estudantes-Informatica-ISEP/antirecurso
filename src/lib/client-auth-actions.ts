'use client';

import { signIn, signOut } from 'next-auth/react';

async function clearAppSessionBestEffort() {
  try {
    await signOut({ redirect: false });
  } catch {
    // Hard navigation/sign-in below remains the recovery path for transient sign-out failures.
  }
}

export async function signOutFromApp(callbackUrl = '/') {
  await clearAppSessionBestEffort();
  window.location.href = callbackUrl;
}

export async function switchAuthNeiAccount(callbackUrl = '/') {
  await clearAppSessionBestEffort();
  await signIn('zitadel', { callbackUrl }, { prompt: 'select_account' });
}
