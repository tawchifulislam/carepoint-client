export function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-md border border-border bg-surface p-5 shadow-card">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className="mt-2 font-mono text-3xl font-semibold text-ink">{value}</p>
    </div>
  );
}
