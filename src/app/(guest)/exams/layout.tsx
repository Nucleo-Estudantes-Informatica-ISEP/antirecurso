'use client';

import React from 'react';
import ExamContextProvider from 'src/contexts/ExamContext';

interface ExamLayoutProps {
  children: React.ReactNode;
}

const ExamLayout: React.FC<ExamLayoutProps> = ({ children }) => {
  return (
    <ExamContextProvider>
      <section className="w-full mt-8">{children}</section>
    </ExamContextProvider>
  );
};

export default ExamLayout;
