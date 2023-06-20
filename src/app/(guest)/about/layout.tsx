'use client';

import React from 'react';

interface AboutLayoutProps {
  children: React.ReactNode;
}

const AboutLayout: React.FC<AboutLayoutProps> = ({ children }) => {
  return (
    <div className="h-[120vh] sm:h-[116vh] md:h-[91vh] ">
      <>{children}</>
    </div>
  );
};

export default AboutLayout;
