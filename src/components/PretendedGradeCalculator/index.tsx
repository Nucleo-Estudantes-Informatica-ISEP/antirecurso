'use client';

import { useContext, useState } from 'react';
import { GradeCalculatorContext } from 'src/contexts/GradeCalculatorContext';
import toFixed from 'src/utils/toFixed';

interface GradeCalculatorProps {
  weight: number;
  min_grade: number;
}

const PretendedGradeCalculator: React.FC<GradeCalculatorProps> = ({ weight, min_grade }) => {
  const MAX_GRADE = 20;

  const [pretended, setPretendGrade] = useState<number | null>(null);

  const { frequency } = useContext(GradeCalculatorContext);

  const finalGradePretended =
    !frequency || !pretended
      ? null
      : Math.max(0, toFixed((pretended - 0.5 - frequency * (1 - weight)) / weight, 2));

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 w-full mx-auto my-6">
      <div className="flex items-center justify-between gap-x-2 w-full">
        <div className="h-0.5 w-1/3 bg-primary rounded opacity-70"></div>
        <h1 className="text-xl md:text-3xl w-full font-bold text-center mx-auto">
          Nota necessária no <span className="text-primary">exame</span> para atingir o teu objetivo
          na UC!
        </h1>
        <div className="h-0.5 w-1/3 bg-primary rounded opacity-70"></div>
      </div>
      <div className="flex flex-col md:flex-row gap-y-4 items-center justify-center">
        <div className="flex items-center gap-x-2 w-full">
          <label className="text-right text-lg w-32" htmlFor="pretended">
            Objetivo
          </label>
          <input
            className="w-full p-2 mr-7 rounded-lg border-2 border-primary"
            value={pretended === null ? '' : pretended}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') setPretendGrade(null);
              if (value.match(/^\d{1,}$/)) {
                if (parseInt(value) < 0) return setPretendGrade(0);
                if (parseInt(value) > MAX_GRADE) return setPretendGrade(MAX_GRADE);
                setPretendGrade(parseInt(value));
              }
            }}
            step={0.1}
            type="number"
          />
        </div>
      </div>
      <p className="text-xl">
        Nota <span className="text-primary">necessária</span>:{' '}
        <span
          className={`font-bold  ${
            frequency === null ||
            finalGradePretended === null ||
            finalGradePretended > 20 ||
            finalGradePretended < min_grade
              ? 'text-red-500'
              : 'text-green-500'
          }`}>
          {frequency === null
            ? 'Preenche o campo da nota da frequência!'
            : finalGradePretended === null
            ? '--'
            : finalGradePretended > 20
            ? 'Impossível. Tens de estudar mais.'
            : finalGradePretended}
        </span>
      </p>
    </div>
  );
};

export default PretendedGradeCalculator;
