'use client';

import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { Field, controlClass } from './field';

interface FormSelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'id'
> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  function FormSelect(
    { label, error, hint, optional, className = '', children, ...props },
    ref,
  ) {
    return (
      <Field label={label} error={error} hint={hint} optional={optional}>
        {control => (
          <div className="relative">
            <select
              {...props}
              {...control}
              ref={ref}
              className={`${controlClass(Boolean(error))} appearance-none pr-11 ${className}`}
            >
              {children}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          </div>
        )}
      </Field>
    );
  },
);
