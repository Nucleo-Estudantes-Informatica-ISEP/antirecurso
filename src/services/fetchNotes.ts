import { BASE_URL } from 'src/services/api';
import Note from 'src/types/Note';

const fetchNotes = async (id: string, token: string): Promise<Note[]> => {
  const res = await fetch(`${BASE_URL}/subjects/${id}/notes`, {
    cache: 'no-store',
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error fetching subject notes');

  const notes = await res.json();
  return notes.data;
};

export default fetchNotes;
