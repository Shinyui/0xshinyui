import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  isInvalid?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

export default function Textarea({
  label,
  error,
  isInvalid = false,
  showCharCount = false,
  maxLength,
  value,
  className = '',
  onFocus,
  onBlur,
  style,
  ...props
}: TextareaProps) {
  const hasError = isInvalid || !!error;
  const charCount = typeof value === 'string' ? value.length : 0;

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
      <textarea
        value={value}
        className={`w-full resize-y rounded-md border p-3 text-sm transition-all duration-200 ${className}`}
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: hasError ? 'var(--accent-negative)' : 'var(--border-color)',
          color: 'var(--text-primary)',
          minHeight: '80px',
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
        maxLength={maxLength}
        {...props}
      />
      <div className="flex justify-between items-center mt-1">
        {error && (
          <p
            className="text-sm"
            style={{ color: 'var(--accent-negative)' }}
          >
            ❌ {error}
          </p>
        )}
        {showCharCount && maxLength && (
          <span
            className="text-xs ml-auto"
            style={{ color: 'var(--text-muted)' }}
          >
            {charCount} / {maxLength} 字符
          </span>
        )}
      </div>
    </div>
  );
}
