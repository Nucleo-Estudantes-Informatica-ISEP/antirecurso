import Score from './Score';

export default interface User {
  id: number;
  name: string;
  email: string;
  is_admin: number;
  scores: Score[];
}
