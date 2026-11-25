'use client';

import { signIn, signOut } from 'next-auth/react';

const localBase = 'https://antirecurso.invalid';

function localDestination(value: string | null) {
  if (!value?.startsWith('/')) return;
  try {
    const url = new URL(value, localBase);
    if (url.origin === localBase && !url.pathname.startsWith('//'))
      return url.pathname + url.search + url.hash;
  } catch {
    // Fall back to the localized home for malformed input.
  }
}

export async function startAuthNei(destination: string | null, fallback: string, register = false) {
  const options = { callbackUrl: localDestination(destination) ?? fallback };
  if (register) await signIn('zitadel', options, { prompt: 'create' });
  else await signIn('zitadel', options);
}

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
