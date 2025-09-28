import React, { TextareaHTMLAttributes, forwardRef } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, showCharCount, maxLength = 140, className = '', value = '', ...props }, ref) => {
    const textareaClasses = `
      block w-full px-3 py-2 border rounded-md shadow-sm 
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
      ${error ? 'border-red-300' : 'border-gray-300'}
      ${props.disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
      ${className}
    `;

    const charCount = typeof value === 'string' ? value.length : 0;
    const isOverLimit = charCount > maxLength;

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaClasses}
          value={value}
          maxLength={maxLength}
          {...props}
        />
        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500">{helperText}</p>
            )}
          </div>
          {showCharCount && (
            <p className={`text-sm ${isOverLimit ? 'text-red-600' : 'text-gray-500'}`}>
              {charCount}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;