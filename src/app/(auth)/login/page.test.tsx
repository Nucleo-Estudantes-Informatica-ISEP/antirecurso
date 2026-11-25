// @vitest-environment happy-dom
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { signIn } from 'next-auth/react';
import { LanguageProvider } from '@/i18n/client';
import Login from './page';
import Register from '../register/page';
const current = vi.hoisted(() => ({ query: '' }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/login',
  useSearchParams: () => new URLSearchParams(current.query)
}));
vi.mock('next-auth/react', () => ({ signIn: vi.fn() }));
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  current.query = '';
});
it('starts AuthNEI automatically and returns to the English homepage by default', async () => {
  render(
    <LanguageProvider lang="pt">
      <Login />
    </LanguageProvider>
  );
  await waitFor(() => expect(signIn).toHaveBeenCalledWith('zitadel', { callbackUrl: '/en' }));
});
it('preserves the intended localized destination through authentication', async () => {
  current.query = 'callbackUrl=%2Fen%2Fexams%2F17%2Fanswer%2Fcustom%3Ffilter%3Dnew';
  render(
    <LanguageProvider lang="en">
      <Login />
    </LanguageProvider>
  );
  await waitFor(() =>
    expect(signIn).toHaveBeenCalledWith('zitadel', {
      callbackUrl: '/en/exams/17/answer/custom?filter=new'
    })
  );
});

it('falls back to the localized homepage for a nonlocal callback', async () => {
  current.query = new URLSearchParams({ callbackUrl: 'https://example.test/' }).toString();
  render(
    <LanguageProvider lang="en">
      <Login />
    </LanguageProvider>
  );
  await waitFor(() => expect(signIn).toHaveBeenCalledWith('zitadel', { callbackUrl: '/en' }));
});

it('starts hosted registration and rejects a cross-origin return URL', async () => {
  current.query = 'callbackUrl=%2F%2Fevil.example';
  render(
    <LanguageProvider lang="en">
      <Register />
    </LanguageProvider>
  );

  await waitFor(() =>
    expect(signIn).toHaveBeenCalledWith('zitadel', { callbackUrl: '/en' }, { prompt: 'create' })
  );
});

it('shows a retry after an AuthNEI error without starting another redirect', () => {
  current.query = 'error=OAuthSignin&callbackUrl=%2Fen%2Fprofile';
  render(
    <LanguageProvider lang="en">
      <Login />
    </LanguageProvider>
  );

  expect(screen.getByRole('alert')).toBeVisible();
  expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute(
    'href',
    '/en/login?callbackUrl=%2Fen%2Fprofile'
  );
  expect(signIn).not.toHaveBeenCalled();
});
