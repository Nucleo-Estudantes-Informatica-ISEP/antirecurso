export default interface Comment {
  id: number;
  comment: string;
  user: string;
  user_avatar: string;
  question_id: number;
  created_at: string;
  is_admin: boolean;
}
