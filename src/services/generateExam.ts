import { BASE_URL } from 'src/services/api';
import Question from 'src/types/Question';

const generateExam = async (id: number): Promise<Question[]> => {
  console.log(process.env);
  const res = await fetch(BASE_URL + `/exams/generate/${id}`);
  if (!res.ok) throw new Error('Error fetching subjects');

  const exam = await res.json();
  return exam;
};

export default generateExam;
