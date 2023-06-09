import Score from './Score';

export default interface Subject {
  id: number;
  name: string;
  slug: string;
  year: number;
  scores: Score[];
}
