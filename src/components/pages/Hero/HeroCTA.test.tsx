// @vitest-environment jsdom
/// <reference types="@testing-library/jest-dom" />
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

afterEach(cleanup);

import type User from '@/types/User';

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

vi.mock('@/hooks/useSession', () => ({
  default: vi.fn()
}));

import useSession from '@/hooks/useSession';

import HeroCTA from './HeroCTA';

const mockUser: User = {
  id: 1,
  name: 'Test User',
  email: 'test@test.com',
  is_admin: 0,
  avatar: '',
  scores: [],
  answers: []
};

const baseSession = { token: null, clear: vi.fn(), revalidate: vi.fn() };

describe('HeroCTA', () => {
  it('renders nothing while session is loading', () => {
    vi.mocked(useSession).mockReturnValue({ ...baseSession, user: null, isLoading: true });
    const { container } = render(<HeroCTA />);
    expect(container.firstChild).toBeNull();
  });

  it('renders registration CTA for guests', () => {
    vi.mocked(useSession).mockReturnValue({ ...baseSession, user: null, isLoading: false });
    render(<HeroCTA />);
    expect(screen.getByText(/começar agora/i).closest('a')).toHaveAttribute('href', '/register');
    expect(screen.queryByText(/resolver exames/i)).toBeNull();
  });

  it('renders continuation CTA for authenticated users without register link', () => {
    vi.mocked(useSession).mockReturnValue({ ...baseSession, user: mockUser, isLoading: false });
    render(<HeroCTA />);
    expect(screen.getByText(/resolver exames/i).closest('a')).toHaveAttribute('href', '/exams');
    expect(screen.queryByText(/começar agora/i)).toBeNull();
    expect(document.querySelector('a[href="/register"]')).toBeNull();
  });
});
