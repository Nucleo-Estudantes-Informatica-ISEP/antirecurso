import { LabelHTMLAttributes } from 'react';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
}

const InputLabel: React.FC<InputLabelProps> = ({ value, className }) => {
  return <label className={`block text-sm text-gray-700 ${className}`}>{value}</label>;
};

export default InputLabel;
