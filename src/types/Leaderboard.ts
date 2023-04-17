export default interface Leaderboard {
  subject_id: string;
  name: string;
  scores: {
    user_id: number;
    score: number;
    user_name: string;
  }[];
}
