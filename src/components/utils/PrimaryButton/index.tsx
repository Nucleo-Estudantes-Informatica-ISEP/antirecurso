interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className, onClick, ...rest }) => {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium leading-5 text-center text-white
                  rounded-lg transition-colors duration-150 bg-primary border border-transparent
                  hover:bg-opacity-80 focus:outline-none focus:ring active:bg-primary
                  disabled:bg-opacity-80 disabled:cursor-not-allowed
                  ${className}`}>
      {children}
    </button>
  );
};

export default PrimaryButton;
