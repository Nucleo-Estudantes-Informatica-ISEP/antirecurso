// @vitest-environment happy-dom
/// <reference types="@testing-library/jest-dom" />

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useCallbackUrl', () => ({ default: () => '/' }));
vi.mock('@/hooks/useSession', () => ({
  default: () => ({
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      is_admin: 0,
      avatar: '',
      scores: [],
      answers: []
    },
    clear: vi.fn()
  })
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }) }));
vi.mock('next-themes', () => ({ useTheme: () => ({ theme: 'light' }) }));
vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => children,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => children,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div role="menu">{children}</div>
  ),
  DropdownMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />
}));

import HamburgerProfileMenu from '.';

afterEach(cleanup);

describe('authenticated profile menu', () => {
  it('separates the app profile from AuthNEI account management', () => {
    render(<HamburgerProfileMenu />);

    expect(screen.getByRole('link', { name: 'Perfil' })).toHaveAttribute('href', '/profile');
    expect(screen.getByRole('link', { name: 'Gerir Conta' })).toHaveAttribute(
      'href',
      '/api/auth/profile'
    );
    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });
});
