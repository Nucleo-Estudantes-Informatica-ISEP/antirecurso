'use client';

import { Preview, Trash, Upload } from '@/styles/Icons';
import LoadingSpinner from '../LoadingSpinner';
import { MouseEvent, useRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  accept: string;
  placeholder: string;
  className?: string;
  disabled?: boolean;
  type?: string;
  file?: {
    name: string;
    preview: string;
  } | null;
  icon: React.ReactNode;
  isLoading: boolean;
  onClear: () => void;
}

const FileInput: React.FC<InputProps> = ({
  name,
  placeholder,
  accept,
  className,
  disabled,
  file,
  icon,
  isLoading,
  onClear,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    onClear();
  };

  const handlePreview = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
    e.stopPropagation();
    if (file) window.open(file.preview, '_blank');
  };

  return (
    <div className={`flex w-full flex-row items-center justify-center text-slate-700 ${className}`}>
      <input
        type="file"
        name={name}
        disabled={disabled || isLoading}
        id={name}
        placeholder={placeholder}
        accept={accept}
        hidden
        className={`rounded-md border border-gray-400 bg-slate-200 px-4 py-1
         text-black focus:border-primary focus:ring-0 disabled:text-gray-600`}
        ref={inputRef}
        {...rest}
      />
      <button className="w-full rounded-md" onClick={() => inputRef.current?.click()}>
        <label
          className={
            'flex flex-1 cursor-pointer flex-row items-center rounded-md border border-gray-400 bg-slate-200 px-4 py-2'
          }
          htmlFor={name}>
          <span className="mr-2 min-w-min text-lg md:text-xl">
            {isLoading ? <LoadingSpinner /> : file ? icon : <Upload />}
          </span>
          <span className="truncate">{file ? file.name : name}</span>
          {file && (
            <>
              <button
                onClick={handlePreview}
                className="ml-auto rounded-md p-1 transition-colors hover:bg-gray-600">
                <Preview />
              </button>
              <button
                onClick={handleClear}
                className="ml-2 rounded-md p-1 transition-colors hover:bg-red-500 hover:text-white">
                <Trash />
              </button>
            </>
          )}
        </label>
      </button>
    </div>
  );
};

export default FileInput;
