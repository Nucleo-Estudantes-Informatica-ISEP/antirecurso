import Option from './Option';

export default interface Question {
  id: number;
  question: string;
  exam: string;
  question_type: string;
  options: Option[];
}
