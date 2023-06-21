import { Check } from '@/styles/Icons';
import { motion } from 'framer-motion';
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
            className={`w-full flex items-center px-5 py-3 border border-gray-100 h-16 md:h-20 rounded hover:cursor-pointer hover:bg-primary hover:text-white transition ease-in-out ${
              answers.get(currentQuestionIndex) === option.order && 'bg-primary text-white'
            }`}>
            <p className="capitalize text-sm md:text-base">{option.name.toLowerCase()}</p>
            {answers.get(currentQuestionIndex) === option.order && <Check className="ml-5" />}
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default QuestionPrompt;
