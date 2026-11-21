// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  isLoading: false,
  user: null,
  recoveryRequired: true,
  revalidate: vi.fn()
}));

vi.mock('@/hooks/useSession', () => ({ default: () => state }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({}),
  useSearchParams: () => new URLSearchParams()
}));

import ResolveAccount from './page';

afterEach(cleanup);

it('asks unconfirmed owners to contact support and lets them recheck', () => {
  render(<ResolveAccount />);
  const help = screen.getByRole('link', { name: 'Contactar o apoio do AntiRecurso' });
  expect(help.getAttribute('href')).toBe('mailto:support.antirecurso@nei-isep.org');
  expect(screen.queryByRole('button', { name: /Eliminar/ })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Verificar novamente' }));
  expect(state.revalidate).toHaveBeenCalledOnce();
});
