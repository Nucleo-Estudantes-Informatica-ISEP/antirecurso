import { createContext } from 'react';

export const ExamContext = createContext<{
  examResult: ExamResult | null;
  setExamResult: React.Dispatch<React.SetStateAction<ExamResult | null>>;
  subject: string | null;
  setSubject: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  examResult: null,
  setExamResult: () => {},
  subject: null,
  setSubject: () => {}
});

import React, { useState } from 'react';
import ExamResult from 'src/types/ExamResult';

interface ExamProviderProps {
  children: React.ReactNode;
}

const ExamContextProvider: React.FC<ExamProviderProps> = ({ children }) => {
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [subject, setSubject] = useState<string | null>(null);

  return (
    <ExamContext.Provider value={{ examResult, setExamResult, subject, setSubject }}>
      {children}
    </ExamContext.Provider>
  );
};

export default ExamContextProvider;
