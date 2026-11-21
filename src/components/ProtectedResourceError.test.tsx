// @vitest-environment happy-dom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import ProtectedResourceError from './ProtectedResourceError';

vi.mock('@/hooks/useCallbackUrl', () => ({ default: () => '%2Fpt%2Fnotes%2F17%3Fsort%3Dnew' }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

afterEach(cleanup);

it('preserves the subject, query and selected note on sign-in', () => {
  render(<ProtectedResourceError status={401} anchor="#note-34" />);
  const href = screen.getByRole('link', { name: 'Iniciar sessão' }).getAttribute('href');
  expect(new URL(href!, 'https://example.test').searchParams.get('callbackUrl')).toBe(
    '/pt/notes/17?sort=new#note-34'
  );
});

it('retries the same action on a service outage', () => {
  const retry = vi.fn();
  render(<ProtectedResourceError status={503} onRetry={retry} />);
  fireEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  expect(retry).toHaveBeenCalledOnce();
});
