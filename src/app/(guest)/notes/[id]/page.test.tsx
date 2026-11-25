// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import SubjectNotes from './page';

vi.mock('@/lib/server-auth', () => ({ getApiAccessToken: async () => 'fixture-token' }));
vi.mock('@/i18n/server', () => ({ getMessages: async () => vi.fn() }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/pt/notes/17',
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ refresh: vi.fn() })
}));

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it.each([401, 503])('shows recovery when loading subject notes returns %s', async (status) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status })));
  render(await SubjectNotes({ params: Promise.resolve({ id: '17' }) }));

  if (status === 401) {
    expect(screen.getByRole('link', { name: 'Iniciar sessão' })).toBeInTheDocument();
  } else {
    expect(screen.getByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
  }
});
