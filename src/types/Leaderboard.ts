import Score from './Score';

export default interface Leaderboard {
  subject_id: string;
  name: string;
  scores: Score[];
}
