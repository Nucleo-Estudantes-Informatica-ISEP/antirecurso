import { Check, X } from '@/styles/Icons';
import ExamReview from 'src/types/ExamReview';
import sanitizeOption from 'src/utils/sanitizeOption';

interface QuestionProps {
  currentQuestion: ExamReview['questions'][0];
}

const QuestionReview: React.FC<QuestionProps> = ({ currentQuestion }) => {
  return (
    <>
      <p className="text-lg font-bold mt-5">{currentQuestion.question.question}</p>
      <div className="mt-5 space-y-5">
        {currentQuestion.options.map((option) => (
          <div
            key={option.name}
            className={`w-full flex items-center px-1.5 md:px-4 py-2 md:py-3 border border-gray-100 min-h-[4rem] md:min-h-[5rem] rounded ${
              currentQuestion.selected_option_id === option.id && 'bg-primary text-white'
            }`}>
            <p className="text-xs md:text-base">{sanitizeOption(option.name)}</p>
            {currentQuestion.is_wrong === true &&
              currentQuestion.selected_option_id === option.id && <X className="ml-1.5 md:ml-4" />}
            {currentQuestion.correct_option === option.order && (
              <Check className="ml-1.5 md:ml-4" />
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default QuestionReview;
