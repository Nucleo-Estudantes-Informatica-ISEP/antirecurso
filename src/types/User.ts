import Answer from './Answer'
import Score from './Score'

export default interface User {
  id: number;
  name: string;
  email: string;
  is_admin: number;
  avatar: string;
  scores: Score[];
  answers: Answer[];
  requires_account_resolution?: boolean;
  account_summary?: {
    email: string;
    pending_auth_subject: string;
    scores: number;
    answers: number;
  } | null;
}
