import { afterEach, describe, expect, it, vi } from 'vitest';
import { requestNoteVisit } from './noteActions';

afterEach(() => vi.unstubAllGlobals());

describe('note visit tracking', () => {
  it('returns the note URL only after visit tracking succeeds', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({ url: 'https://storage.example.test/note.pdf' })
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(requestNoteVisit(42)).resolves.toBe('https://storage.example.test/note.pdf');
    expect(fetchMock).toHaveBeenCalledWith('/api/protected/notes/42/view', expect.any(Object));
  });

  it('rejects with the backend error and never produces a blank URL', async () => {
    const fetchMock = vi.fn<typeof fetch>(async () =>
      Response.json({ message: 'Account resolution required' }, { status: 403 })
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(requestNoteVisit(42)).rejects.toMatchObject({
      status: 403,
      backendMessage: 'Account resolution required'
    });
  });

  it('rejects malformed successful responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(async () => Response.json({ url: null }))
    );

    await expect(requestNoteVisit(42)).rejects.toThrow('O backend não devolveu um URL válido');
  });
});
