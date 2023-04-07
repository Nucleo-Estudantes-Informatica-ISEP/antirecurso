import { InputHTMLAttributes, RefObject } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  errorText?: string;
  inputRef?: RefObject<HTMLInputElement>;
}

const TextInput: React.FC<TextInputProps> = ({ className, errorText, inputRef, ...rest }) => {
  return (
    <div>
      <input
        {...rest}
        ref={inputRef}
        className={`${
          errorText ? 'border-2 border-red-600' : 'border border-gray-300'
        } py-1 px-2  rounded-md shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600 ${className}`}
      />
      {errorText && <p className="text-red-500 mt-1 text-xs">{errorText}</p>}
    </div>
  );
};

export default TextInput;
