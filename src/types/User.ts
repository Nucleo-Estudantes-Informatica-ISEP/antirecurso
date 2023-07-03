import Answer from './Answer';
import Score from './Score';

export default interface User {
  id: number;
  name: string;
  email: string;
  is_admin: number;
  avatar: string;
  scores: Score[];
  answers: Answer[];
}
