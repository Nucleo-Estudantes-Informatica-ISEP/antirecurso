import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant'> {
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ children, className, ...rest }, ref) => {
    return (
      <Button ref={ref} className={cn(className)} {...rest}>
        {children}
      </Button>
    );
  }
);
PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
