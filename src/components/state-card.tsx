import type { LucideIcon } from 'lucide-react';

const TONES = {
  amber: 'bg-amber-tint text-amber ring-8 ring-amber-tint/50',
  red: 'bg-red-tint text-red ring-8 ring-red-tint/50',
  primary: 'bg-primary-tint text-primary ring-8 ring-primary-tint/50',
};

export type StateCardTone = keyof typeof TONES;

export function StateCard({
  icon: Icon,
  tone,
  title,
  children,
}: {
  icon: LucideIcon;
  tone: StateCardTone;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-border bg-surface px-6 py-10 text-center shadow-card sm:px-8">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${TONES[tone]}`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink">
        {title}
      </h1>
      <div className="mt-3 space-y-5 text-sm text-ink-muted">{children}</div>
    </div>
  );
}
