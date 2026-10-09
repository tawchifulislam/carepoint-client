'use client';

import { useId } from 'react';

export interface FieldControlProps {
  id: string;
  'aria-invalid'?: true;
  'aria-describedby'?: string;
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: (control: FieldControlProps) => React.ReactNode;
}

export function controlClass(hasError: boolean): string {
  return `w-full rounded-md border bg-surface px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-muted focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
    hasError
      ? 'border-red focus:border-red focus:ring-red/20'
      : 'border-border focus:border-primary focus:ring-primary/20'
  }`;
}

export function Field({
  label,
  error,
  hint,
  optional = false,
  children,
}: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between text-sm font-medium text-ink"
      >
        <span>{label}</span>
        {optional && (
          <span className="text-xs font-normal text-ink-muted">Optional</span>
        )}
      </label>

      <div className="mt-1.5">
        {children({
          id,
          'aria-invalid': error ? true : undefined,
          'aria-describedby': message ? messageId : undefined,
        })}
      </div>

      {message && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={`mt-1.5 text-sm ${error ? 'text-red' : 'text-ink-muted'}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
