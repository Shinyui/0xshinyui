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
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`w-full rounded-md border p-3 text-sm transition-all duration-200 ${className}`}
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: hasError ? '#ef4444' : 'var(--border-color)',
          color: 'var(--text-primary)',
          ...style,
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = hasError ? '#ef4444' : 'var(--accent-cyan)';
          e.currentTarget.style.boxShadow = hasError
            ? '0 0 0 3px rgba(239, 68, 68, 0.2)'
            : '0 0 0 3px rgba(0, 240, 255, 0.16)';
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = hasError ? '#ef4444' : 'var(--border-color)';
          e.currentTarget.style.boxShadow = 'none';
          onBlur?.(e);
        }}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-500">❌ {error}</p>
      )}
    </div>
  );
}
