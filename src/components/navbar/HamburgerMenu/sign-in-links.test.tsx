// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { LanguageProvider } from '@/i18n/client';
import Custom403 from '@/components/pages/Custom403';
import HamburgerMenu from '.';

const path = '/en/exams/17/answer/custom';
const query = 'filter=new&return=%2Fnotes%3Fselected%3D34%26sort%3Dasc';
const destination = path + '?' + query;

vi.mock('next/navigation', () => ({
  usePathname: () => path,
  useSearchParams: () => new URLSearchParams(query),
  useRouter: () => ({})
}));
vi.mock('@/hooks/useSession', () => ({ default: () => ({ user: null }) }));
vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'light' }) }));

afterEach(cleanup);

it('preserves the full destination in mobile sign-in and registration links', async () => {
  render(
    <LanguageProvider lang="en">
      <HamburgerMenu />
    </LanguageProvider>
  );

  fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
  for (const name of ['Sign in', 'Create account']) {
    const link = await screen.findByRole('link', { name });
    const href = new URL(link.getAttribute('href')!, 'https://example.test');
    expect(href.searchParams.get('callbackUrl')).toBe(destination);
  }
});

it('preserves the full destination in the access-denied sign-in link', () => {
  render(
    <LanguageProvider lang="en">
      <Custom403 />
    </LanguageProvider>
  );

  const link = screen.getByRole('link', { name: 'Sign in' });
  const href = new URL(link.getAttribute('href')!, 'https://example.test');
  expect(href.searchParams.get('callbackUrl')).toBe(destination);
});
