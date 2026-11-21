// @vitest-environment happy-dom

import { renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  swal: vi.fn(),
  signOut: vi.fn(),
  clear: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn()
}));
vi.mock('sweetalert', () => ({ default: mocks.swal }));
vi.mock('next-auth/react', () => ({ signOut: mocks.signOut }));
vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'light' }) }));
vi.mock('@/hooks/useSession', () => ({ default: () => ({ clear: mocks.clear }) }));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => mocks }));

import useAuthNeiSignOut from './useAuthNeiSignOut';

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('clears the app session and returns locally without asking AuthNEI to sign out', async () => {
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);
  mocks.swal.mockResolvedValueOnce('app');
  const { result } = renderHook(useAuthNeiSignOut);

  await result.current();

  expect(fetch).not.toHaveBeenCalled();
  expect(mocks.signOut).toHaveBeenCalledWith({ redirect: false });
  expect(mocks.clear).toHaveBeenCalledOnce();
  expect(mocks.push).toHaveBeenCalledWith('/');
});

it('resolves the AuthNEI end-session URL before clearing the app session', async () => {
  const url = 'https://issuer.test/oidc/v1/end_session?post_logout_redirect_uri=https://web.test/';
  const fetch = vi.fn().mockResolvedValue(Response.json({ url }));
  vi.stubGlobal('fetch', fetch);
  const navigate = vi.spyOn(window.location, 'assign').mockImplementation(() => {});
  mocks.swal.mockResolvedValueOnce('shared');
  const { result } = renderHook(useAuthNeiSignOut);

  await result.current();

  expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'PATCH' });
  expect(fetch.mock.invocationCallOrder[0]).toBeLessThan(mocks.signOut.mock.invocationCallOrder[0]);
  expect(mocks.clear).toHaveBeenCalledOnce();
  expect(navigate).toHaveBeenCalledWith(url);
  expect(mocks.push).not.toHaveBeenCalled();
});
