import Subject from './Subject';
import User from './User';

export default interface Note {
  id: number;
  title: string;
  url: string | null;
  views: number;
  user: User;
  subject: Subject;
  description?: string;
  n_pages?: number;
  likes: number;
  is_liked: boolean;
  created_at: Date;
  upload_id: string | null;
}
