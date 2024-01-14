'use client';

import '@/styles/scoreIndicator.css';
import toFixed from '@/utils/toFixed';
import { useEffect, useState } from 'react';

interface ScoreIndicatorProps {
  score: number;
  maxScore?: number;
  className?: string;
}

const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score, maxScore = 100, className }) => {
  const val = (score / maxScore) * 100;
  const deg = (180 / 100) * val;

  const [scoreValue, setScoreValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scoreValue < score) {
        setScoreValue(scoreValue + 1);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [scoreValue, score]);

  return (
    <div className={`${className}`}>
      <div className="indicator">
        <span className="bar" style={{ transform: `rotate(${deg}deg)` }} />
        <span className="result">
          <span>{scoreValue}</span> em <span>{maxScore}</span>
        </span>
        <span className="valores">
          <span>{toFixed(scoreValue / 5, 1)}</span> valores
        </span>
      </div>
    </div>
  );
};

export default ScoreIndicator;
