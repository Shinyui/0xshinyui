import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isInvalid?: boolean;
}

export default function Input({
  label,
  error,
  isInvalid = false,
  className = '',
  onFocus,
  onBlur,
  style,
  ...props
}: InputProps) {
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
      <input
        className={`w-full rounded-md border p-3 text-sm transition-all duration-200 ${className}`}
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
      />
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
