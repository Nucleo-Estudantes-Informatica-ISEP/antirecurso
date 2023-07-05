import Comment from './Comment';
import Option from './Option';

export default interface Question {
  id: number;
  question: string;
  exam: string;
  question_type: string;
  image: string;
  options: Option[];
  comments: Comment[];
}
