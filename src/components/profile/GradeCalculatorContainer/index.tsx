'use client';

import { Card, CardContent } from '@/components/ui/card';
import toFixed from '@/utils/toFixed';
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Peso do exame
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-primary">
              {toFixed(subjectStats.exam_weight * 100, 2)}%
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              A tua nota final é calculada com base neste peso.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center gap-2">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Nota mínima
            </h2>
            <p className="text-3xl md:text-4xl font-bold text-primary">
              {subjectStats.min_grade}{' '}
              <span className="text-lg text-muted-foreground font-medium">valores</span>
            </p>
            <p className="text-sm text-muted-foreground max-w-xs">
              Abaixo deste valor no exame és reprovado automaticamente.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6 md:p-8">
          <GradeCalculator
            examGrade={parseInt(subjectStats.average_grade)}
            weight={subjectStats.exam_weight}
            minGrade={subjectStats.min_grade}
          />
        </CardContent>
      </Card>

      <Card className="mt-4 md:mt-5">
        <CardContent className="p-6 md:p-8">
          <GoalGradeCalculator
            weight={subjectStats.exam_weight}
            min_grade={subjectStats.min_grade}
          />
        </CardContent>
      </Card>
    </GradeCalculatorContextProvider>
  );
};

export default GradeCalculatorContainer;
