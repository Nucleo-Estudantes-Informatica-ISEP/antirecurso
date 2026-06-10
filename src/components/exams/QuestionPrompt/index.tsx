import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
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
      <p className="text-base md:text-lg font-semibold mt-4 leading-relaxed">
        {currentQuestion.question}
      </p>
      <div className="mt-5 space-y-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = answers.get(currentQuestionIndex) === option.order;
          const letter = String.fromCharCode(65 + idx);
          return (
            <motion.button
              animate={{ opacity: [0.2, 1], x: [30, 0] }}
              transition={{ duration: 0.2 }}
              key={option.name}
              onClick={() => selectAnswer(currentQuestionIndex, option.order)}
              className={cn(
                'group w-full flex items-center gap-3 md:gap-4 text-left px-3 md:px-5 py-3 md:py-4 rounded-xl border bg-card transition-all duration-150',
                'hover:border-primary/50 hover:bg-accent/40 hover:shadow-sm',
                isSelected &&
                  'border-primary bg-primary text-primary-foreground hover:bg-primary/95 hover:border-primary shadow-md shadow-primary/20'
              )}
            >
              <span
                className={cn(
                  'flex size-7 md:size-8 shrink-0 items-center justify-center rounded-full border text-xs md:text-sm font-bold transition-colors',
                  isSelected
                    ? 'border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground'
                    : 'border-border bg-muted text-muted-foreground group-hover:border-primary/40 group-hover:text-primary'
                )}
              >
                {letter}
              </span>
              <p className="text-sm md:text-base leading-relaxed flex-1">
                {sanitizeOption(option.name)}
              </p>
              {isSelected && <Check className="size-4 md:size-5 shrink-0" />}
            </motion.button>
          );
        })}
      </div>
    </>
  );
};

export default QuestionPrompt;
