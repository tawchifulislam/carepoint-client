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
      className={`rounded-full px-3 py-1 text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
