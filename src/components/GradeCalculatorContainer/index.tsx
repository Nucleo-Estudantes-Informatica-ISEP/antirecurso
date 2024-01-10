'use client';

import GradeCalculatorContextProvider from 'src/contexts/GradeCalculatorContext';
import GoalGradeCalculator from '../GoalGradeCalculator';
import GradeCalculator from '../GradeCalculator';

interface GradeCalculatorProps {
  subjectStats: {
    average_grade: string;
    exam_weight: number;
    min_grade: number;
  };
}

const GradeCalculatorContainer: React.FC<GradeCalculatorProps> = ({ subjectStats }) => {
  return (
    <GradeCalculatorContextProvider>
      <section className="flex items-center flex-col md:flex-row justify-center gap-y-8 gap-x-24 w-full">
        <article className="flex flex-col justify-between items-center gap-y-2 min-h-40 md:h-64 w-full max-w-lg p-8 text-xl bg-gray-100 rounded-md gap-x-2 dark:bg-secondary-dark text-left">
          <h2 className="text-xl md:text-3xl font-bold text-center">Peso do Exame</h2>
          <span className="font-bold text-primary align-middle text-3xl md:text-4xl text-center">
            {subjectStats.exam_weight * 100}%
          </span>
          <div className="text-center text-base md:block hidden">
            A tua nota final é calculada com base neste peso.
          </div>
        </article>
        <article className="flex flex-col justify-between items-center gap-y-2 min-h-40 md:h-64 w-full max-w-lg p-8 text-xl bg-gray-100 rounded-md gap-x-2 dark:bg-secondary-dark text-left">
          <h2 className="text-xl md:text-3xl font-bold text-center">Nota Mínima</h2>
          <span className="font-bold text-primary align-middle text-3xl md:text-4xl text-center">
            {subjectStats.min_grade} <span className="text-2xl">valores</span>
          </span>
          <div className="text-center text-base md:block hidden">
            Se obtiveres uma nota inferior a este valor no exame, és reprovado automaticamente.
          </div>
        </article>
      </section>

      <GradeCalculator
        examGrade={parseInt(subjectStats.average_grade)}
        weight={subjectStats.exam_weight}
        minGrade={subjectStats.min_grade}
      />
      <GoalGradeCalculator weight={subjectStats.exam_weight} min_grade={subjectStats.min_grade} />
    </GradeCalculatorContextProvider>
  );
};

export default GradeCalculatorContainer;
