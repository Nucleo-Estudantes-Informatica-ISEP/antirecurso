// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  signOut: vi.fn(),
  clear: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn()
}));
vi.mock('next-auth/react', () => ({ signOut: mocks.signOut }));
vi.mock('@/hooks/useSession', () => ({ default: () => ({ clear: mocks.clear }) }));
vi.mock('@/i18n/navigation', () => ({ useRouter: () => mocks }));

import SignOutDialog from './SignOutDialog';

function openDialog() {
  const onOpenChange = vi.fn();
  render(<SignOutDialog open onOpenChange={onOpenChange} triggerRef={{ current: null }} />);
  return onOpenChange;
}

function choose(scope: 'app' | 'shared') {
  fireEvent.click(
    screen.getByRole('button', {
      name: scope === 'app' ? /Terminar só no AntiRecurso/ : /Terminar também no AuthNEI/
    })
  );
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('clears the app session and returns locally without asking AuthNEI to sign out', async () => {
  const fetch = vi.fn();
  vi.stubGlobal('fetch', fetch);
  openDialog();
  choose('app');
  await waitFor(() => expect(mocks.push).toHaveBeenCalledWith('/'));

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
  openDialog();
  choose('shared');

  await waitFor(() => expect(navigate).toHaveBeenCalledWith(url));
  expect(fetch).toHaveBeenCalledWith('/api/auth/logout', { method: 'PATCH' });
  expect(fetch.mock.invocationCallOrder[0]).toBeLessThan(mocks.signOut.mock.invocationCallOrder[0]);
  expect(mocks.clear).toHaveBeenCalledOnce();
  expect(navigate).toHaveBeenCalledWith(url);
  expect(mocks.push).not.toHaveBeenCalled();
});

it.each([
  ['the issuer request fails', () => new Response(null, { status: 503 })],
  ['the response has no logout URL', () => Response.json({})]
])('offers app-only sign-out when %s', async (_reason, response) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response()));
  const navigate = vi.spyOn(window.location, 'assign').mockImplementation(() => {});
  openDialog();
  choose('shared');

  expect(await screen.findByRole('alert')).toHaveTextContent('só nesta aplicação');
  expect(screen.getByRole('button', { name: /Terminar só no AntiRecurso/ })).toBeEnabled();
  expect(mocks.signOut).not.toHaveBeenCalled();
  expect(mocks.clear).not.toHaveBeenCalled();
  expect(navigate).not.toHaveBeenCalled();
  expect(mocks.push).not.toHaveBeenCalled();
});

it('keeps the user in the app when the local sign-out fails after preparing shared sign-out', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(Response.json({ url: 'https://issuer.test/logout' }))
  );
  const navigate = vi.spyOn(window.location, 'assign').mockImplementation(() => {});
  mocks.signOut.mockRejectedValueOnce(new Error('Session service unavailable'));
  openDialog();
  choose('shared');

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Não foi possível terminar a sessão nesta aplicação. Tenta novamente.'
  );
  expect(navigate).not.toHaveBeenCalled();
  expect(mocks.clear).not.toHaveBeenCalled();
});

it('allows cancellation without ending either session', () => {
  const onOpenChange = openDialog();
  fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(onOpenChange).toHaveBeenCalledWith(false);
  expect(mocks.signOut).not.toHaveBeenCalled();
});
