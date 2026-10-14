// @vitest-environment happy-dom
import { act, cleanup, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { LanguageProvider } from '@/i18n/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import useSession from '@/hooks/useSession';
import Exams from './page';

vi.mock('@/hooks/useSession', () => ({ default: vi.fn() }));
const navigation = vi.hoisted(() => ({ lang: 'pt' }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/' + navigation.lang + '/exams/17/answer',
  useRouter: () => ({ push: vi.fn() })
}));
vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

afterEach(() => {
  cleanup();
  navigation.lang = 'pt';
});

async function renderPicker(token: string | null) {
  vi.mocked(useSession).mockReturnValue({
    token,
    user: null,
    isLoading: false,
    clear: vi.fn(),
    revalidate: vi.fn()
  });

  await act(async () => {
    render(
      <LanguageProvider lang="pt">
        <Suspense>
          <Exams params={Promise.resolve({ id: '17' })} />
        </Suspense>
      </LanguageProvider>
    );
  });
}

describe('exam mode access', () => {
  it('lets guests select random and realistic exams while locking account modes', async () => {
    await renderPicker(null);

    expect(screen.getByRole('link', { name: /Modo Aleatório/ })).toHaveAttribute(
      'href',
      '/pt/exams/17/answer/default'
    );
    expect(screen.getByRole('link', { name: /Modo Realista/ })).toHaveAttribute(
      'href',
      '/pt/exams/17/answer/realistic'
    );
    expect(screen.getAllByRole('link')).toHaveLength(2);
    expect(screen.getAllByText('Conta necessária')).toHaveLength(4);
    expect(screen.getByRole('button', { name: /Modo Personalizado/ })).toBeDisabled();
  });

  it('keeps all available modes accessible after login and duel unavailable', async () => {
    await renderPicker('server-session');

    for (const mode of ['default', 'realistic', 'new', 'wrong', 'hard']) {
      expect(document.querySelector(`a[href="/pt/exams/17/answer/${mode}"]`)).toBeInTheDocument();
    }
    expect(screen.queryByText('Conta necessária')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Modo Personalizado/ })).toBeEnabled();
    expect(screen.queryByRole('link', { name: /Modo Duelo/ })).not.toBeInTheDocument();
    expect(screen.getByText('Em breve')).toBeInTheDocument();
  });
});

it('shows English labels and keeps guest restrictions on English routes', async () => {
  navigation.lang = 'en';
  await renderPicker(null);
  expect(screen.getByRole('link', { name: /Random mode/ })).toHaveAttribute(
    'href',
    '/en/exams/17/answer/default'
  );
  expect(screen.getByRole('button', { name: /Custom mode/ })).toBeDisabled();
  expect(screen.getAllByText('Account required')).toHaveLength(4);
});
