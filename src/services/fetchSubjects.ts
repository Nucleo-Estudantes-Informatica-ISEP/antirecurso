import { BASE_URL } from 'src/services/api';
import Subject from 'src/types/Subject';

const fetchSubjects = async (): Promise<Subject[]> => {
  const res = await fetch(BASE_URL + '/subjects');
  if (!res.ok) throw new Error('Error fetching subjects');

  const subjects = await res.json();
  return subjects;
};

export default fetchSubjects;
