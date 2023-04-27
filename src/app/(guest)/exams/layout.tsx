'use client';

import React from 'react';
import ExamContextProvider from 'src/contexts/ExamContext';

interface ExamLayoutProps {
  children: React.ReactNode;
}

const ExamLayout: React.FC<ExamLayoutProps> = ({ children }) => {
  return (
    <div>
      <ExamContextProvider>{children}</ExamContextProvider>
    </div>
  );
};

export default ExamLayout;
