// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  user: { requires_account_resolution: false },
  request: vi.fn(),
  confirm: vi.fn(),
  clear: vi.fn(),
  signOut: vi.fn()
}));

vi.mock('@/hooks/useSession', () => ({ default: () => state }));
vi.mock('@/services/apiClient', () => ({ apiRequest: state.request }));
vi.mock('@/lib/client-auth-actions', () => ({ signOutFromApp: state.signOut }));
vi.mock('sweetalert', () => ({ default: state.confirm }));

import AccountDataSettings from './AccountDataSettings';

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  state.user.requires_account_resolution = false;
});

it('requires explicit confirmation in preferences before deleting app data', async () => {
  state.confirm.mockResolvedValueOnce(false).mockResolvedValueOnce(true);
  render(<AccountDataSettings />);
  const button = screen.getByRole('button', { name: 'Eliminar dados do AntiRecurso' });

  fireEvent.click(button);
  await waitFor(() => expect((button as HTMLButtonElement).disabled).toBe(false));
  expect(state.request).not.toHaveBeenCalled();

  fireEvent.click(button);
  await waitFor(() => expect(state.signOut).toHaveBeenCalledWith('/pt'));
  expect(state.request).toHaveBeenCalledOnce();
  expect(state.request).toHaveBeenCalledWith('user', {
    method: 'DELETE',
    authenticated: true,
    json: { confirmation: 'DELETE_ANTIRECURSO_DATA' }
  });
});

it('hides deletion when ownership is still pending', () => {
  state.user.requires_account_resolution = true;
  render(<AccountDataSettings />);
  expect(screen.queryByRole('button')).toBeNull();
});
