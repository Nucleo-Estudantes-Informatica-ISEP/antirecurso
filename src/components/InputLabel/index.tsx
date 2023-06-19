import { LabelHTMLAttributes, LegacyRef } from 'react';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
  ref?: LegacyRef<HTMLLabelElement>;
}

const InputLabel: React.FC<InputLabelProps> = ({ value, className, ref }) => {
  return (
    <label ref={ref} className={`block text-sm text-gray-700 ${className}`}>
      {value}
    </label>
  );
};

export default InputLabel;
