'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertTriangle } from 'lucide-react';
import { useContext, useState } from 'react';
import { GradeCalculatorContext } from 'src/contexts/GradeCalculatorContext';
import toFixed from 'src/utils/toFixed';

interface GradeCalculatorProps {
  examGrade: number;
  weight: number;
  minGrade: number;
}

const GradeCalculator: React.FC<GradeCalculatorProps> = ({ examGrade, weight, minGrade }) => {
  const MAX_GRADE = 20;

  const [exam, setExam] = useState<number | null>((examGrade * MAX_GRADE) / 100);
  const { frequency, setFrequency } = useContext(GradeCalculatorContext);

  const finalGrade =
    !frequency || !exam ? null : toFixed(frequency * (1 - weight) + exam * weight, 2);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold">
          Calcula a tua nota <span className="gradient-text">final</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-2">
          <Label htmlFor="frequency">Frequência</Label>
          <Input
            id="frequency"
            value={frequency === null ? '' : frequency}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') setFrequency(null);
              if (value.match(/^\d{1,}(\.\d{0,2})?$/)) {
                if (parseFloat(value) < 0) return setFrequency(0);
                if (parseFloat(value) > MAX_GRADE) return setFrequency(MAX_GRADE);
                setFrequency(toFixed(parseFloat(value), 2));
              }
            }}
            step={0.1}
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="exam">Exame</Label>
          <div className="flex items-center gap-2">
            <Input
              id="exam"
              value={exam === null ? '' : exam}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '') setExam(null);
                const val = value.match(/^\d{1,}(\.\d{0,2})?$/);
                if (val) {
                  if (parseFloat(value) < 0) return setExam(0);
                  if (parseFloat(value) > MAX_GRADE) return setExam(MAX_GRADE);
                  setExam(toFixed(parseFloat(value), 2));
                }
              }}
              step={0.1}
              type="number"
            />
            {exam && exam < minGrade && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="text-destructive shrink-0 p-1.5 rounded-md hover:bg-destructive/10"
                    >
                      <AlertTriangle className="size-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    A tua nota no exame é inferior à nota mínima para aprovação.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>

      <div className="text-center py-4 rounded-xl bg-muted/40 border">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
          A tua nota final atual
        </p>
        {finalGrade !== null ? (
          <p
            className={`text-3xl md:text-4xl font-bold ${
              finalGrade >= 9.5 ? 'text-emerald-500' : 'text-destructive'
            }`}
          >
            {finalGrade}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Preenche os campos acima para veres a tua nota final
          </p>
        )}
      </div>
    </div>
  );
};

export default GradeCalculator;
