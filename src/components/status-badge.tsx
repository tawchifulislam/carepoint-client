const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT: 'bg-amber-tint text-amber',
  BOOKED: 'bg-primary-tint text-primary',
  COMPLETED: 'bg-border text-ink-muted',
  CANCELLED: 'bg-red-tint text-red',
  NO_SHOW: 'bg-red-tint text-red',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pending payment',
  BOOKED: 'Booked',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No show',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status] ?? 'bg-border text-ink-muted'}`}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
