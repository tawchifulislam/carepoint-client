'use client';

import { forwardRef } from 'react';
import { Field, controlClass } from './field';

interface FormFieldProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'id'
> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  trailing?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    { label, error, hint, optional, trailing, className = '', ...props },
    ref,
  ) {
    return (
      <Field label={label} error={error} hint={hint} optional={optional}>
        {control => (
          <div className="relative">
            <input
              {...props}
              {...control}
              ref={ref}
              className={`${controlClass(Boolean(error))} ${trailing ? 'pr-12' : ''} ${className}`}
            />
            {trailing && (
              <div className="absolute inset-y-0 right-2 flex items-center">
                {trailing}
              </div>
            )}
          </div>
        )}
      </Field>
    );
  },
);
