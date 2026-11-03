import type { ApprovalStatus } from '@/types/admin';

const STYLES: Record<ApprovalStatus, string> = {
  PENDING: 'bg-amber-tint text-amber',
  APPROVED: 'bg-primary-tint text-primary-hover',
  REJECTED: 'bg-red-tint text-red',
};

const LABELS: Record<ApprovalStatus, string> = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export function ApprovalBadge({ status }: { status: ApprovalStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {LABELS[status]}
    </span>
  );
}
