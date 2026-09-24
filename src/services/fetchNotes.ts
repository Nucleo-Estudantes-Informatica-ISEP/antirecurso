import Note from '@/types/Note';
import Pagination from '@/types/Pagination';
import { apiRequest } from './apiClient';

const fetchNotes = async (id: string, token: string): Promise<Pagination<Note>> => {
  return apiRequest<Pagination<Note>>(`subjects/${id}/notes`, {
    authenticated: true,
    accessToken: token,
    cache: 'no-store',
    errorMessage: 'Error fetching subject notes'
  });
};

export default fetchNotes;
