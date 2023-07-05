import { Check } from '@/styles/Icons';
import { motion } from 'framer-motion';
import Question from 'src/types/Question';
import sanitizeOption from 'src/utils/sanitizeOption';

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
      <p className="text-base md:text-lg font-bold mt-5">{currentQuestion.question}</p>
      <div className="mt-5 space-y-5">
        {currentQuestion.options.map((option) => (
          <motion.div
            animate={{
              opacity: [0.2, 1],
              x: [50, 0]
            }}
            transition={{
              duration: 0.2
            }}
            key={option.name}
            onClick={() => selectAnswer(currentQuestionIndex, option.order)}
            className={`w-full flex items-center px-2 md:px-4 py-2 md:py-3 border border-gray-100 min-h-[4rem] md:min-h-[5rem] rounded hover:cursor-pointer hover:bg-primary hover:text-white transition ease-in-out ${
              answers.get(currentQuestionIndex) === option.order && 'bg-primary text-white'
            }`}>
            <p className="text-xs md:text-base">{sanitizeOption(option.name)}</p>
            {answers.get(currentQuestionIndex) === option.order && (
              <Check className="ml-2 md:ml-4" />
            )}
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default QuestionPrompt;
