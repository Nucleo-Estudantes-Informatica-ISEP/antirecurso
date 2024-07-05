import Option from './Option';

export interface Report {
  id: number;
  user: string;
  email: string;
  reason: string;
  question_id: string;
  question: {
    id: number;
    title: string;
    image: string;
    exam: string;
    correct_option: string;
    options: Option[];
  };
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewed_by: {
    name: string;
    email: string;
  } | null;
  solved: boolean | string;
}
