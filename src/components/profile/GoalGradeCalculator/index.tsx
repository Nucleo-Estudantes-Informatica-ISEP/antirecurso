'use client';

import { useMessages } from '@/i18n/client';

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
  const t = useMessages();

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
          {t('copy.required_grade_in_the')} <span className="gradient-text">{t('copy.exam')}</span>
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('copy.to_reach_your_target_for_the_subject')}
        </p>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <Label htmlFor="pretended">{t('copy.target_grade_0_20')}</Label>
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
          {t('copy.required_grade')}
        </p>
        {frequency === null ? (
          <p className="text-sm text-muted-foreground">
            {t('copy.enter_your_coursework_grade_above')}
          </p>
        ) : finalGradeNeeded === null ? (
          <p className="text-sm text-muted-foreground">{t('copy.enter_your_target_grade')}</p>
        ) : isImpossible ? (
          <p className="text-base text-destructive">{t('copy.that_grade_cannot_be_reached')}</p>
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
