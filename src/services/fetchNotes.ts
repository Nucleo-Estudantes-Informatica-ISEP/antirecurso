import { BASE_URL } from '@/services/api';
import Note from '@/types/Note';
import Pagination from '@/types/Pagination';

const fetchNotes = async (id: string, token: string): Promise<Pagination<Note>> => {
  const res = await fetch(`${BASE_URL}/subjects/${id}/notes`, {
    cache: 'no-store',
    headers: {
      authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Error fetching subject notes');

  const notes = await res.json();
  return notes;
};

export default fetchNotes;
