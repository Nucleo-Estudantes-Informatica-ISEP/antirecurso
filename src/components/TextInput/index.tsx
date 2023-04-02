import { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({ disabled, children, className }) => {
  return (
    <input
      disabled={disabled}
      className={`mt-1 border-gray-300 rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600 ${className}`}
    />
  );
};

export default TextInput;
