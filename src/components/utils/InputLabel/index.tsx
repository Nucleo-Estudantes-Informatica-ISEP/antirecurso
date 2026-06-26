import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { LabelHTMLAttributes, LegacyRef } from 'react';

interface InputLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  value?: string;
  className?: string;
  ref?: LegacyRef<HTMLLabelElement>;
}

const InputLabel: React.FC<InputLabelProps> = ({ value, className, ref, htmlFor }) => {
  return (
    <Label ref={ref} className={cn('mb-2 block', className)} htmlFor={htmlFor}>
      {value}
    </Label>
  );
};

export default InputLabel;
