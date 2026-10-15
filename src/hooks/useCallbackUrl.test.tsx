// @vitest-environment happy-dom
import { renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import useCallbackUrl from './useCallbackUrl';
const current = vi.hoisted(() => ({ path: '/en/exams/17', query: 'mode=custom&filter=new' }));
vi.mock('next/navigation', () => ({
  usePathname: () => current.path,
  useSearchParams: () => new URLSearchParams(current.query)
}));
vi.mock('@/i18n/client', () => ({ useLanguage: () => 'en' }));
it('encodes the full localized destination as a single callback parameter', () => {
  const { result } = renderHook(useCallbackUrl);
  expect(decodeURIComponent(result.current)).toBe('/en/exams/17?mode=custom&filter=new');
  expect(result.current).toContain('%26');
});
it('returns to the language homepage instead of the login page', () => {
  current.path = '/en/login';
  current.query = '';
  const { result } = renderHook(useCallbackUrl);
  expect(decodeURIComponent(result.current)).toBe('/en');
});
it('preserves an explicitly supplied callback', () => {
  current.path = '/en/register';
  current.query = 'callbackUrl=%2Fen%2Fprofile';
  const { result } = renderHook(useCallbackUrl);
  expect(decodeURIComponent(result.current)).toBe('/en/profile');
});
