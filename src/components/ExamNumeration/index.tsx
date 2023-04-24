import { Key } from 'react';

interface ExamNumerationProps {
  wasAnswered?: boolean;
  active?: boolean;
  isWrong?: boolean;
  key?: Key;
  onClick: () => void;
  children: React.ReactNode;
}

const ExamNumeration: React.FC<ExamNumerationProps> = ({
  wasAnswered,
  active,
  key,
  onClick,
  isWrong,
  children
}) => {
  return (
    <div
      key={key}
      onClick={onClick}
      className={`h-10 w-10 p-5 flex items-center justify-center ${
        active
          ? 'bg-primary text-white'
          : wasAnswered
          ? 'bg-primary bg-opacity-70 text-white'
          : 'border border-primary text-primary'
      }
        ${isWrong && 'bg-red-500 text-white'}
      }
              rounded-full hover:cursor-pointer`}>
      <p>{children}</p>
    </div>
  );
};

export default ExamNumeration;
