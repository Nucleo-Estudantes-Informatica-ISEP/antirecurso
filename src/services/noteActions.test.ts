import { describe, expect, it, vi } from 'vitest';
import { requestNoteVisit } from './noteActions';

describe('note visit tracking', () => {
  it('returns the note URL only after visit tracking succeeds', async () => {
    const fetchAuthenticated = vi.fn(async () =>
      Response.json({ url: 'https://storage.example.test/note.pdf' })
    );

    await expect(requestNoteVisit(42, fetchAuthenticated)).resolves.toBe(
      'https://storage.example.test/note.pdf'
    );
    expect(fetchAuthenticated).toHaveBeenCalledWith('notes/42/view', { method: 'POST' });
  });

  it('rejects with the backend error and never produces a blank URL', async () => {
    const fetchAuthenticated = vi.fn(async () =>
      Response.json({ message: 'Account resolution required' }, { status: 403 })
    );

    await expect(requestNoteVisit(42, fetchAuthenticated)).rejects.toMatchObject({
      status: 403,
      backendMessage: 'Account resolution required'
    });
  });

  it('rejects malformed successful responses', async () => {
    const fetchAuthenticated = vi.fn(async () => Response.json({ url: null }));

    await expect(requestNoteVisit(42, fetchAuthenticated)).rejects.toThrow(
      'O backend não devolveu um URL válido'
    );
  });
});
