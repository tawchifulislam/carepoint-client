import { Check, Loader2 } from 'lucide-react';

interface ProgressStepsProps {
  steps: string[];
  current: number;
  stalled?: boolean;
}

export function ProgressSteps({
  steps,
  current,
  stalled = false,
}: ProgressStepsProps) {
  return (
    <ol>
      {steps.map((label, index) => {
        const done = index < current;
        const active = index === current;
        const isLast = index === steps.length - 1;

        let circleClass = 'border-border bg-surface text-ink-muted';
        if (done) circleClass = 'border-primary bg-primary text-white';
        if (active) {
          circleClass = stalled
            ? 'border-amber bg-amber-tint text-amber'
            : 'border-primary bg-primary-tint text-primary';
        }

        return (
          <li
            key={label}
            aria-current={active ? 'step' : undefined}
            className="relative flex gap-4 pb-8 last:pb-0"
          >
            {!isLast && (
              <span
                aria-hidden="true"
                className={`absolute left-3.75 top-8 h-[calc(100%-2rem)] w-0.5 transition-colors duration-300 ${
                  done ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}

            <span
              className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${circleClass}`}
            >
              {done && <Check className="h-4 w-4" strokeWidth={2.5} />}
              {active && (
                <Loader2
                  className={`h-4 w-4 ${stalled ? '' : 'animate-spin'}`}
                />
              )}
              {!done && !active && (
                <span className="font-mono text-xs">{index + 1}</span>
              )}
            </span>

            <span
              className={`pt-1 text-sm ${done || active ? 'font-semibold text-ink' : 'text-ink-muted'}`}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
