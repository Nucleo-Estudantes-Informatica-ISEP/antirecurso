import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import ExamReview from 'src/types/ExamReview';
import sanitizeOption from 'src/utils/sanitizeOption';

interface QuestionProps {
  currentQuestion: ExamReview['questions'][0];
}

const QuestionReview: React.FC<QuestionProps> = ({ currentQuestion }) => {
  return (
    <>
      <p className="text-base md:text-lg font-semibold mt-4 leading-relaxed">
        {currentQuestion.question.question}
      </p>
      <div className="mt-5 space-y-3">
        {currentQuestion.options.map((option, idx) => {
          const isSelected = currentQuestion.selected_option_id === option.id;
          const isCorrect = currentQuestion.correct_option === option.order;
          const isWrongSelection = currentQuestion.is_wrong === true && isSelected;
          const letter = String.fromCharCode(65 + idx);

          return (
            <div
              key={option.name}
              className={cn(
                'w-full flex items-center gap-3 md:gap-4 px-3 md:px-5 py-3 md:py-4 rounded-xl border bg-card',
                isCorrect && 'border-emerald-500 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100',
                isWrongSelection &&
                  'border-destructive bg-destructive/10 text-destructive-foreground dark:text-red-100'
              )}
            >
              <span
                className={cn(
                  'flex size-7 md:size-8 shrink-0 items-center justify-center rounded-full border text-xs md:text-sm font-bold',
                  isCorrect && 'border-emerald-500 bg-emerald-500 text-white',
                  isWrongSelection && 'border-destructive bg-destructive text-white',
                  !isCorrect && !isWrongSelection && 'border-border bg-muted text-muted-foreground'
                )}
              >
                {letter}
              </span>
              <p className="text-sm md:text-base leading-relaxed flex-1">
                {sanitizeOption(option.name)}
              </p>
              {isWrongSelection && <X className="size-5 shrink-0 text-destructive" />}
              {isCorrect && <Check className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default QuestionReview;
