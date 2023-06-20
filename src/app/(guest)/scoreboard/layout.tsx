'use client';

import React from 'react';

interface ScoreboardLayoutProps {
  children: React.ReactNode;
}

const ScoreboardLayout: React.FC<ScoreboardLayoutProps> = ({ children }) => {
  return (
    <div className="h-[120vh] sm:h-[116vh] md:h-[91vh] ">
      <>{children}</>
    </div>
  );
};

export default ScoreboardLayout;
