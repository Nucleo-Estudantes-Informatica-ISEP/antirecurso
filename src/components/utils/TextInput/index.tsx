import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, RefObject } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  errorText?: string;
  placeholder?: string;
  inputRef?: RefObject<HTMLInputElement>;
}

const TextInput: React.FC<TextInputProps> = ({
  className,
  errorText,
  placeholder,
  inputRef,
  ...rest
}) => {
  return (
    <div className="w-full">
      <Input
        {...rest}
        ref={inputRef}
        placeholder={placeholder}
        className={cn(errorText && 'border-destructive focus-visible:ring-destructive', className)}
      />
      <div className="h-5 py-1">
        {errorText && <p className="text-xs text-destructive">{errorText}</p>}
      </div>
    </div>
  );
};

export default TextInput;
