import '@/styles/scoreIndicator.css';
import toFixed from '@/utils/toFixed';

interface ScoreIndicatorProps {
  score: number;
  maxScore?: number;
  className?: string;
}

const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score, maxScore = 100, className }) => {
  const val = (score / maxScore) * 100;
  const deg = (180 / 100) * val;
  return (
    <div className={`${className}`}>
      <div className="indicator">
        <span className="bar" style={{ transform: `rotate(${deg}deg)` }} />
        <span className="result">
          <span>{score}</span> em <span>{maxScore}</span>
        </span>
        <span className="valores">
          <span>{toFixed((score * 20) / 100, 1)}</span> valores
        </span>
      </div>
    </div>
  );
};

export default ScoreIndicator;
