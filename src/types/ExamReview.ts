import { Comment } from './Comment';
import Option from './Option';

export default interface ExamReview {
  id: string;
  score: number;
  taken_at: string;
  subject: string;
  questions: {
    question: {
      id: number;
      question: string;
      correct_option: string;
      question_type: string;
      image: string;
    };
    options: Option[];
    selected_option_id: number;
    is_wrong: boolean;
    correct_option: string;
    comments: Comment[];
  }[];
}
