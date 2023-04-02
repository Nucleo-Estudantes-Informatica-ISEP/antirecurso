interface PrimaryButtonProps {
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className }) => {
  return (
    <button
      className={`px-4 py-2 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-primary border border-transparent rounded-lg active:bg-primary hover:bg-opacity-80 focus:outline-none focus:ring ${className}`}>
      {children}
    </button>
  );
};

export default PrimaryButton;
