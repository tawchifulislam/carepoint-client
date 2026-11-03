export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className = '',
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="font-mono text-xs font-semibold tracking-wide text-primary-hover">
            {eyebrow}
          </p>
        )}
        <h1
          className={`text-3xl font-bold tracking-tight text-ink md:text-4xl ${eyebrow ? 'mt-2' : ''}`}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-ink-muted">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
