'use client';

import GradeCalculatorContextProvider from 'src/contexts/GradeCalculatorContext';
import GradeCalculator from '../GradeCalculator';
import GoalGradeCalculator from '../GoalGradeCalculator';

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
