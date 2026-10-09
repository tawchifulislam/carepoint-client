'use client';

import { forwardRef } from 'react';
import { Field, controlClass } from './field';

interface FormTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'id'
> {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    { label, error, hint, optional, className = '', ...props },
    ref,
  ) {
    return (
      <Field label={label} error={error} hint={hint} optional={optional}>
        {control => (
          <textarea
            {...props}
            {...control}
            ref={ref}
            className={`${controlClass(Boolean(error))} resize-y ${className}`}
          />
        )}
      </Field>
    );
  },
);
