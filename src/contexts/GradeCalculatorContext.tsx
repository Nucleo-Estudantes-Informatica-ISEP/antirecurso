import { createContext } from 'react';

export const GradeCalculatorContext = createContext<{
  frequency: number | null;
  setFrequency: React.Dispatch<React.SetStateAction<number | null>>;
}>({
  frequency: null,
  setFrequency: () => {} // @typescript-eslint/no-empty-function
});

import React, { useState } from 'react';

interface GradeCalculatorContextProviderProps {
  children: React.ReactNode;
}

const GradeCalculatorContextProvider: React.FC<GradeCalculatorContextProviderProps> = ({
  children
}) => {
  const [frequency, setFrequency] = useState<number | null>(10.0);

  return (
    <GradeCalculatorContext.Provider value={{ frequency, setFrequency }}>
      {children}
    </GradeCalculatorContext.Provider>
  );
};

export default GradeCalculatorContextProvider;
