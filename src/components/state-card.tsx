import type { LucideIcon } from 'lucide-react';

const TONES = {
  amber: 'bg-amber-tint text-amber',
  red: 'bg-red-tint text-red',
  primary: 'bg-primary-tint text-primary',
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
    <div className="mx-auto w-full max-w-md text-center">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${TONES[tone]}`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">
        {title}
      </h1>
      <div className="mt-3 space-y-5 text-sm text-ink-muted">{children}</div>
    </div>
  );
}
