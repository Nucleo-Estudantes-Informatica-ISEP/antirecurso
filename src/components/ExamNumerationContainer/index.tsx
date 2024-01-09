interface ExamNumerationContainerProps {
  children: React.ReactNode;
}

const ExamNumerationContainer: React.FC<ExamNumerationContainerProps> = ({ children }) => {
  return (
    <div className="w-11/12 mx-auto flex items-center justify-center gap-x-10 overflow-x-scroll mt-5 px-5">
      {children}
    </div>
  );
};

export default ExamNumerationContainer;
