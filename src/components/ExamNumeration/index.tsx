import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

interface ExamNumerationProps {
  wasAnswered?: boolean;
  active?: boolean;
  isWrong?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  align: 'start' | 'end' | 'center';
}

const ExamNumeration: React.FC<ExamNumerationProps> = ({
  wasAnswered,
  active,
  onClick,
  isWrong,
  children,
  align
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [questionInView, setQuestionInView] = useState<HTMLElement>();

  useEffect(() => {
    if (active) {
      setQuestionInView(questionInView);
      if (ref.current) {
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: align
        });
      }
    }
  }, [active, questionInView]);

  return (
    <motion.div
      animate={{
        opacity: [0, 1],
        scale: active ? [1, 1.05] : [0.8, 1],
        background: active ? '#d35d19' : wasAnswered ? '#d35d1970' : isWrong ? '#f00' : '#fff'
      }}
      transition={{
        duration: 0.2,
        delay: 0.1,
        ease: 'easeInOut',
        background: {
          duration: 0.2
        }
      }}
      style={{
        border: active ? 'none' : wasAnswered ? 'none' : '1px solid #d35d19',
        color: active ? '#fff' : wasAnswered ? '#d35d19' : isWrong ? '#fff' : '#d35d19'
      }}
      ref={ref}
      onClick={onClick}
      className="h-10 w-10 p-5 flex items-center justify-center rounded-full hover:cursor-pointer">
      <p>{children}</p>
    </motion.div>
  );
};

export default ExamNumeration;
