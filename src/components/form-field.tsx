import { forwardRef, useId } from 'react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  trailing?: React.ReactNode;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField(
    { label, error, hint, trailing, id, className = '', ...props },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const messageId = `${fieldId}-message`;
    const message = error ?? hint;

    return (
      <div>
        <label htmlFor={fieldId} className="text-sm font-medium text-ink">
          {label}
        </label>

        <div className="relative mt-1.5">
          <input
            {...props}
            ref={ref}
            id={fieldId}
            aria-invalid={error ? true : undefined}
            aria-describedby={message ? messageId : undefined}
            className={`w-full rounded-md border bg-surface px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink-muted focus:outline-none focus:ring-2 ${
              error
                ? 'border-red focus:border-red focus:ring-red/20'
                : 'border-border focus:border-primary focus:ring-primary/20'
            } ${trailing ? 'pr-12' : ''} ${className}`}
          />
          {trailing && (
            <div className="absolute inset-y-0 right-2 flex items-center">
              {trailing}
            </div>
          )}
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
  },
);
