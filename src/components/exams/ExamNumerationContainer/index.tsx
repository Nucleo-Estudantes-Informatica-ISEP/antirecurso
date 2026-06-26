interface ExamNumerationContainerProps {
  children: React.ReactNode;
}

const ExamNumerationContainer: React.FC<ExamNumerationContainerProps> = ({ children }) => {
  return (
    <div className="w-full flex items-center md:justify-center gap-x-2 md:gap-x-3 overflow-x-auto px-4 py-3">
      {children}
    </div>
  );
};

export default ExamNumerationContainer;
