import React, { forwardRef } from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  isInvalid?: boolean;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, isInvalid = false, options, className = '', style, onFocus, onBlur, ...props }, ref) => {
    const hasError = isInvalid || !!error;

    return (
      <div className="w-full">
        {label && (
          <label
            className="block mb-2 text-sm font-medium"
            style={{ color: 'var(--text-primary)' }}
          >
            {label}
            {props.required && (
              <span className="ml-1" style={{ color: 'var(--accent-negative)' }}>
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          className={`w-full cursor-pointer rounded-md border p-3 text-sm transition-all duration-200 ${className}`}
          style={{
            backgroundColor: 'var(--surface)',
            borderColor: hasError ? 'var(--accent-negative)' : 'var(--border-color)',
            color: 'var(--text-primary)',
            ...style,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = hasError ? 'var(--accent-negative)' : 'var(--accent-mint)';
            e.currentTarget.style.boxShadow = hasError
              ? '0 0 0 3px rgba(246, 70, 93, 0.22)'
              : '0 0 0 3px rgba(84, 255, 213, 0.18)';
            onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = hasError ? 'var(--accent-negative)' : 'var(--border-color)';
            e.currentTarget.style.boxShadow = 'none';
            onBlur?.(e);
          }}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              style={{
                backgroundColor: 'var(--card-background)',
                color: 'var(--text-primary)',
              }}
            >
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            className="mt-2 text-sm"
            style={{ color: 'var(--accent-negative)' }}
          >
            ❌ {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
