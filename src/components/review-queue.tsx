'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { formatSlotDate } from '@/lib/format';
import { usePagedList } from '@/lib/use-paged-list';
import { ApprovalBadge } from '@/components/approval-badge';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { ApprovalStatus } from '@/types/admin';

type Filter = ApprovalStatus | 'ALL';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'PENDING', label: 'Pending' },
  { id: 'APPROVED', label: 'Approved' },
  { id: 'REJECTED', label: 'Rejected' },
  { id: 'ALL', label: 'All' },
];

const CHIP_BASE =
  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors';
const CHIP_ACTIVE = 'border-primary bg-primary text-white';
const CHIP_IDLE =
  'border-border bg-surface text-ink hover:border-primary hover:text-primary-hover';

const SMALL_PRIMARY =
  'rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover active:scale-[0.97] disabled:opacity-50';
const SMALL_SECONDARY =
  'rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-paper disabled:opacity-50';
const SMALL_DANGER =
  'rounded-sm px-3 py-1.5 text-xs font-semibold text-red transition-colors hover:bg-red-tint disabled:opacity-50';

interface ReviewItem {
  id: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
}

export interface ReviewRowInfo {
  title: string;
  subtitle: string;
  detail: string;
}

interface ReviewQueueProps<T extends ReviewItem> {
  noun: 'clinic' | 'doctor';
  toRow: (item: T) => ReviewRowInfo;
  revokeWarning: string;
}

export function ReviewQueue<T extends ReviewItem>({
  noun,
  toRow,
  revokeWarning,
}: ReviewQueueProps<T>) {
  const [filter, setFilter] = useState<Filter>('PENDING');
  const path = `/api/admin/${noun}s?pageSize=20${filter === 'ALL' ? '' : `&status=${filter}`}`;
  const { items, total, error, loadingMore, hasMore, reload, loadMore } =
    usePagedList<T>(path);

  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<T | null>(null);

  const activeLabel = FILTERS.find(item => item.id === filter)?.label ?? 'All';
  const revoking = confirmTarget?.approvalStatus === 'APPROVED';

  async function decide(item: T, status: 'APPROVED' | 'REJECTED') {
    setActioningId(item.id);
    setActionError(null);

    try {
      const response = await apiFetch(
        `/api/admin/${noun}s/${item.id}/approval`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setActionError(
          typeof data.error === 'string'
            ? data.error
            : `Could not update this ${noun}.`,
        );
        return;
      }

      await reload();
    } catch {
      setActionError('Something went wrong. Please try again.');
    } finally {
      setActioningId(null);
    }
  }

  async function confirmDecision() {
    if (!confirmTarget) return;

    await decide(confirmTarget, 'REJECTED');
    setConfirmTarget(null);
  }

  function actionsFor(item: T) {
    const busy = actioningId === item.id;

    if (item.approvalStatus === 'APPROVED') {
      return (
        <button
          onClick={() => setConfirmTarget(item)}
          disabled={busy}
          className={SMALL_DANGER}
        >
          Revoke
        </button>
      );
    }

    return (
      <>
        <button
          onClick={() => decide(item, 'APPROVED')}
          disabled={busy}
          className={SMALL_PRIMARY}
        >
          Approve
        </button>
        {item.approvalStatus === 'PENDING' && (
          <button
            onClick={() => setConfirmTarget(item)}
            disabled={busy}
            className={SMALL_SECONDARY}
          >
            Reject
          </button>
        )}
      </>
    );
  }

  let emptyText = `No ${activeLabel.toLowerCase()} ${noun}s.`;
  if (filter === 'PENDING') emptyText = `No ${noun}s are waiting for review.`;
  if (filter === 'ALL') emptyText = `No ${noun}s yet.`;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {FILTERS.map(item => (
          <button
            key={item.id}
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`${CHIP_BASE} ${filter === item.id ? CHIP_ACTIVE : CHIP_IDLE}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {items !== null && (
        <p className="mt-5 text-sm text-ink-muted">
          {total} {filter === 'ALL' ? '' : `${activeLabel.toLowerCase()} `}
          {total === 1 ? noun : `${noun}s`}
        </p>
      )}

      {actionError && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red"
        >
          {actionError}
        </p>
      )}

      <div className="mt-4">
        {error && items === null && (
          <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
            <p className="font-semibold text-ink">Could not load this list</p>
            <p className="mt-1 text-sm text-ink-muted">
              Check your connection and try again.
            </p>
            <button onClick={reload} className={`${PRIMARY_BUTTON} mt-5`}>
              Try again
            </button>
          </div>
        )}

        {!error && items === null && (
          <div className="space-y-2">
            <div className="h-20 animate-pulse rounded-lg bg-border" />
            <div className="h-20 animate-pulse rounded-lg bg-border" />
            <div className="h-20 animate-pulse rounded-lg bg-border" />
          </div>
        )}

        {items !== null && items.length === 0 && (
          <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
            <p className="text-ink">{emptyText}</p>
          </div>
        )}

        {items !== null && items.length > 0 && (
          <ul className="space-y-2">
            {items.map(item => {
              const info = toRow(item);

              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-4 rounded-lg border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="truncate font-semibold text-ink">
                        {info.title}
                      </p>
                      <ApprovalBadge status={item.approvalStatus} />
                    </div>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {info.subtitle}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {info.detail} &middot; Applied{' '}
                      {formatSlotDate(item.createdAt)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    {actionsFor(item)}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {error && items !== null && (
          <p role="alert" className="mt-4 text-sm text-red">
            Something went wrong while loading.{' '}
            <button onClick={reload} className="font-semibold underline">
              Try again
            </button>
          </p>
        )}

        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="mt-4 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Show more'}
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmTarget !== null}
        title={revoking ? 'Revoke approval?' : `Reject this ${noun}?`}
        description={
          confirmTarget
            ? revoking
              ? `${toRow(confirmTarget).title}. ${revokeWarning}`
              : `${toRow(confirmTarget).title}. The applicant will see that their application was not approved. You can approve it again later.`
            : ''
        }
        confirmLabel={revoking ? 'Revoke approval' : `Reject ${noun}`}
        cancelLabel="Cancel"
        loading={confirmTarget !== null && actioningId === confirmTarget.id}
        onConfirm={confirmDecision}
        onClose={() => setConfirmTarget(null)}
      />
    </div>
  );
}
