export default interface Comment {
  id: number;
  comment: string;
  user_id: number;
  question_id: number;
  created_at: Date;
}
