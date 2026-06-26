'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContext, useState } from 'react';
import { GradeCalculatorContext } from 'src/contexts/GradeCalculatorContext';
import toFixed from 'src/utils/toFixed';

interface GradeCalculatorProps {
  weight: number;
  min_grade: number;
}

const GoalGradeCalculator: React.FC<GradeCalculatorProps> = ({ weight, min_grade }) => {
  const MAX_GRADE = 20;

  const [pretended, setPretendGrade] = useState<number | null>(null);
  const { frequency } = useContext(GradeCalculatorContext);

  const finalGradeNeeded =
    !frequency || !pretended
      ? null
      : Math.max(0, toFixed((pretended - 0.5 - frequency * (1 - weight)) / weight, 2));

  const isImpossible = finalGradeNeeded !== null && finalGradeNeeded > 20;
  const isOk =
    frequency !== null &&
    finalGradeNeeded !== null &&
    finalGradeNeeded <= 20 &&
    finalGradeNeeded >= min_grade;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold">
          Nota necessária no <span className="gradient-text">exame</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Para atingires o teu objetivo na UC
        </p>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <Label htmlFor="pretended">Nota objetivo (0–20)</Label>
        <Input
          id="pretended"
          value={pretended === null ? '' : pretended}
          onChange={(e) => {
            const value = e.target.valueAsNumber;
            if (Number.isNaN(value)) setPretendGrade(null);
            else {
              if (value < 0) return setPretendGrade(0);
              if (value > MAX_GRADE) return setPretendGrade(MAX_GRADE);
              setPretendGrade(value);
            }
          }}
          step={0.1}
          type="number"
        />
      </div>

      <div className="text-center py-4 rounded-xl bg-muted/40 border">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
          Nota necessária
        </p>
        {frequency === null ? (
          <p className="text-sm text-muted-foreground">Preenche a frequência acima</p>
        ) : finalGradeNeeded === null ? (
          <p className="text-sm text-muted-foreground">Preenche a nota pretendida</p>
        ) : isImpossible ? (
          <p className="text-base text-destructive">Não é possível atingir essa nota 😕</p>
        ) : (
          <p
            className={`text-3xl md:text-4xl font-bold ${
              isOk ? 'text-emerald-500' : 'text-destructive'
            }`}
          >
            {finalGradeNeeded}
          </p>
        )}
      </div>
    </div>
  );
};

export default GoalGradeCalculator;
