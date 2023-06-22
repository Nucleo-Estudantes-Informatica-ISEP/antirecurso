export default interface Comment {
  id: number;
  comment: string;
  user: string;
  question_id: number;
  created_at: string;
  is_admin: boolean;
}
