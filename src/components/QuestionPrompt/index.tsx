import { Check } from '@/styles/Icons';
import Question from 'src/types/Question';

interface QuestionProps {
  currentQuestion: Question;
  selectAnswer: (questionIndex: number, optionOrder: string) => void;
  currentQuestionIndex: number;
  answers: Map<number, string>;
}

const QuestionPrompt: React.FC<QuestionProps> = ({
  currentQuestion,
  selectAnswer,
  currentQuestionIndex,
  answers
}) => {
  return (
    <>
      <p className="text-lg font-bold mt-5">{currentQuestion.question}</p>
      <p className="text-sm text-gray-600 mt-2">
        Tipo de pergunta '{currentQuestion.question_type}' do exame '{currentQuestion.exam}'
      </p>
      <div className="mt-5 space-y-5">
        {currentQuestion.options.map((option) => (
          <div
            key={option.name}
            onClick={() => selectAnswer(currentQuestionIndex, option.order)}
            className={`w-full flex items-center px-5 py-3 border border-gray-100 h-20 rounded hover:cursor-pointer hover:bg-primary hover:text-white transition ease-in-out ${
              answers.get(currentQuestionIndex) === option.order && 'bg-primary text-white'
            }`}>
            <p>{option.name}</p>
            {answers.get(currentQuestionIndex) === option.order && <Check className="ml-5" />}
          </div>
        ))}
      </div>
    </>
  );
};

export default QuestionPrompt;
