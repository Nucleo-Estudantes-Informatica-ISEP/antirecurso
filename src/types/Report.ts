export default interface Report {
  id: number;
  reason: string;
  question_id: number;
  created_at: string;
  updated_at: string;
  user_id: number;
  review_at: string;
  review_by: number;
  solved: number;
}
