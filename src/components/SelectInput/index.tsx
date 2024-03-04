'use client';

interface InputSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name?: string;
  center?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  options?: InputSelectOption[];
}

export interface InputSelectOption {
  label: string;
  value: string | number;
}

const SelectInput: React.FC<InputSelectProps> = ({
  name,
  center,
  placeholder,
  className,
  disabled,
  options,
  ...rest
}) => {
  return (
    <div className="flex w-full flex-col">
      {name && (
        <label
          className={`text-slate-700 md:text-lg ${center ? ' mb-4 text-center' : ''}`}
          htmlFor={name}>
          {name}
        </label>
      )}
      <select
        name={name}
        id={name}
        disabled={disabled}
        placeholder={placeholder}
        className={`rounded-md border border-gray-400 bg-transparent px-4 py-2
          focus:border-primary focus:ring-0 disabled:text-gray-600 ${className}`}
        {...rest}>
        <option key="default" value="" selected disabled>
          {placeholder}
        </option>
        {options &&
          options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
      </select>
    </div>
  );
};

export default SelectInput;
