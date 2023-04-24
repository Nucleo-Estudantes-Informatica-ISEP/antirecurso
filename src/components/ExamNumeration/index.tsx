import Question from 'src/types/Question';
import PrimaryButton from '../PrimaryButton';
import Skeleton from 'react-loading-skeleton';
import { FormEvent } from 'react';

interface ExamNumerationProps {
  questions: Question[];
  currentQuestionIndex: number;
  changeQuestion: (index: number) => void;
  wasAnswered: (index: number) => boolean | null;
  submit: (e: FormEvent<HTMLFormElement> | void) => void;
}

const N_SKELETON_QUESTIONS = 10;

const ExamNumeration: React.FC<ExamNumerationProps> = ({
  questions,
  currentQuestionIndex,
  changeQuestion,
  wasAnswered,
  submit
}) => {
  return (
    <>
      {questions[0] ? (
        <div className="w-screen flex items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
          <PrimaryButton
            className={`h-10 w-10 p-5 items-center !rounded-full flex justify-center mr-4 ${
              currentQuestionIndex === 0 ? 'opacity-50' : ''
            }`}
            onClick={() => changeQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}>
            {'<'}
          </PrimaryButton>
          {questions.map((question, i) => (
            <div
              key={question.id}
              onClick={() => changeQuestion(i)}
              className={`h-10 w-10 p-5 flex items-center justify-center ${
                currentQuestionIndex === i
                  ? 'bg-primary text-white'
                  : wasAnswered(i)
                  ? 'bg-primary bg-opacity-70 text-white'
                  : 'border border-primary text-primary'
              }
              rounded-full hover:cursor-pointer`}>
              <p>{i + 1}</p>
            </div>
          ))}
          <PrimaryButton
            className={`h-10 w-10 p-5 items-center !rounded-full flex justify-center ${
              currentQuestionIndex === questions.length - 1 ? 'opacity-50' : ''
            }`}
            onClick={() => changeQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === questions.length - 1}>
            {'>'}
          </PrimaryButton>
          <form onSubmit={submit}>
            <PrimaryButton>Terminar</PrimaryButton>
          </form>
        </div>
      ) : (
        <div className="w-screen flex  items-center md:justify-center space-x-10 overflow-x-scroll md:overflow-auto mt-5 px-5">
          {Array.from({ length: N_SKELETON_QUESTIONS }).map((_, i) => (
            <Skeleton className="h-10 w-10 p-5 flex items-center justify-center " circle={true} />
          ))}
        </div>
      )}
    </>
  );
};

export default ExamNumeration;
