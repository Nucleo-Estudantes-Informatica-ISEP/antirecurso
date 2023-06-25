'use client';

import { useState } from 'react';
import toFixed from 'src/utils/toFixed';

interface GradeCalculatorProps {
  examGrade: number;
  weight: number;
}

const GradeCalculator: React.FC<GradeCalculatorProps> = ({ examGrade, weight }) => {
  const MAX_GRADE = 20;

  const [frequency, setFrequency] = useState<number>(10);
  const [exam, setExam] = useState<number>((examGrade * MAX_GRADE) / 100);

  const finalGrade = toFixed(frequency * (1 - weight) + exam * weight, 2);

  return (
    <div>
      <h1>Calcula a tua Nota</h1>
      <label htmlFor="frequency">Frequência</label>
      <input
        value={frequency}
        onChange={(e) => {
          if (parseInt(e.target.value) > MAX_GRADE) return setFrequency(MAX_GRADE);
          if (parseInt(e.target.value) < 0) return setFrequency(0);
          setFrequency(parseInt(e.target.value));
        }}
        pattern="^\d*(\.\d{0,2})?$"
        type="number"
        step=".01"
      />

      <label htmlFor="frequency">Exame</label>
      <input
        value={exam}
        pattern="^\d*(\.\d{0,2})?$"
        onChange={(e) => {
          if (parseInt(e.target.value) > MAX_GRADE) return setExam(MAX_GRADE);
          if (parseInt(e.target.value) < 0) return setExam(0);
          setExam(parseInt(e.target.value));
        }}
        type="number"
        step={0.01}
      />

      <p className="text-xl">
        A tua nota final:{' '}
        <span className={`${finalGrade >= 9.5 ? 'text-green-500' : 'text-red-500'}`}>
          {finalGrade ? finalGrade : '--'}
        </span>
      </p>
    </div>
  );
};

export default GradeCalculator;
