import { InputHTMLAttributes, RefObject } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  errorText?: string;
  inputRef?: RefObject<HTMLInputElement>;
}

const TextInput: React.FC<TextInputProps> = ({ className, errorText, inputRef, ...rest }) => {
  return (
    <div className="">
      <input
        {...rest}
        ref={inputRef}
        className={`${
          errorText ? 'border-2 border-red-600' : 'border border-gray-300'
        } w-full dark:bg-primary-dark dark:text-white py-1.5 px-2.5 rounded-md shadow-sm dark:shadow-secondary-dark focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50 focus-within:text-primary-600 ${className}`}
      />
      <div className="h-5 py-1">
        {errorText && <p className="text-xs italic text-red-500">{errorText}</p>}
      </div>
    </div>
  );
};

export default TextInput;
