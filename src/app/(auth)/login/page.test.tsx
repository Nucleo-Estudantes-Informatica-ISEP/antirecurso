// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { signIn } from 'next-auth/react';
import { LanguageProvider } from '@/i18n/client';
import Login from './page';
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
it('renders English login and returns to the English homepage by default', async () => {
  render(
    <LanguageProvider lang="pt">
      <Login />
    </LanguageProvider>
  );
  expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Continue to sign in' }));
  await waitFor(() => expect(signIn).toHaveBeenCalledWith('zitadel', { callbackUrl: '/en' }));
});
it('preserves the intended localized destination through authentication', async () => {
  current.query = 'callbackUrl=%2Fen%2Fexams%2F17%2Fanswer%2Fcustom%3Ffilter%3Dnew';
  render(
    <LanguageProvider lang="en">
      <Login />
    </LanguageProvider>
  );
  fireEvent.click(screen.getByRole('button', { name: 'Continue to sign in' }));
  await waitFor(() =>
    expect(signIn).toHaveBeenCalledWith('zitadel', {
      callbackUrl: '/en/exams/17/answer/custom?filter=new'
    })
  );
  const register = screen.getByRole('link', { name: /Create one now/ });
  expect(register.getAttribute('href')).toContain('/en/register?callbackUrl=');
});
