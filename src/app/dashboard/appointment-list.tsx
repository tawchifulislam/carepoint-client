'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatSlotDate, formatSlotTime } from '@/lib/format';
import { useNow } from '@/lib/use-now';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { Paginated } from '@/types/pagination';
import type { PatientAppointment } from '@/types/appointment';
import { AppointmentRow } from './appointment-row';
import { NextAppointmentCard } from './next-appointment-card';

const PAGE_SIZE = 50;
const CANCELLATION_CUTOFF_MS = 2 * 60 * 60 * 1000;
const ROW_BUTTON =
  'rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-paper';
const ROW_DANGER =
  'rounded-sm px-3 py-1.5 text-xs font-semibold text-red transition-colors hover:bg-red-tint';

function byStartAsc(a: PatientAppointment, b: PatientAppointment) {
  return a.slotStart.localeCompare(b.slotStart);
}

function byStartDesc(a: PatientAppointment, b: PatientAppointment) {
  return b.slotStart.localeCompare(a.slotStart);
}

export function AppointmentList() {
  const nowMs = useNow();

  const [items, setItems] = useState<PatientAppointment[] | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loadError, setLoadError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<PatientAppointment | null>(
    null,
  );
  const [cancelling, setCancelling] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (pageNumber: number): Promise<Paginated<PatientAppointment>> => {
      const response = await apiFetch(
        `/api/appointments/me?page=${pageNumber}&pageSize=${PAGE_SIZE}`,
      );

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      return response.json();
    },
    [],
  );

  const loadFirstPage = useCallback(async () => {
    setLoadError(false);

    try {
      const result = await fetchPage(1);
      setItems(result.data);
      setPage(1);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      setLoadError(true);
    }
  }, [fetchPage]);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  async function loadMore() {
    setLoadingMore(true);
    setActionError(null);

    try {
      const result = await fetchPage(page + 1);

      setItems(current => {
        const existing = current ?? [];
        const known = new Set(existing.map(item => item.id));
        return [
          ...existing,
          ...result.data.filter(item => !known.has(item.id)),
        ];
      });
      setPage(result.page);
      setTotalPages(result.totalPages);
    } catch {
      setActionError('Could not load older appointments.');
    } finally {
      setLoadingMore(false);
    }
  }

  async function confirmCancel() {
    if (!cancelTarget) return;

    setCancelling(true);
    setActionError(null);

    try {
      const response = await apiFetch(
        `/api/appointments/${cancelTarget.id}/cancel`,
        { method: 'PATCH' },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setActionError(
          typeof data.error === 'string'
            ? data.error
            : 'Could not cancel this appointment.',
        );
        setCancelTarget(null);
        return;
      }

      setCancelTarget(null);
      await loadFirstPage();
    } catch {
      setActionError('Something went wrong. Please try again.');
      setCancelTarget(null);
    } finally {
      setCancelling(false);
    }
  }

  const { upcoming, history } = useMemo(() => {
    const list = items ?? [];

    const upcomingItems = list
      .filter(
        item =>
          (item.status === 'BOOKED' || item.status === 'PENDING_PAYMENT') &&
          new Date(item.slotStart).getTime() > nowMs,
      )
      .sort(byStartAsc);

    const upcomingIds = new Set(upcomingItems.map(item => item.id));
    const historyItems = list
      .filter(item => !upcomingIds.has(item.id))
      .sort(byStartDesc);

    return { upcoming: upcomingItems, history: historyItems };
  }, [items, nowMs]);

  function canModify(item: PatientAppointment) {
    return (
      item.status === 'BOOKED' &&
      new Date(item.slotStart).getTime() - nowMs > CANCELLATION_CUTOFF_MS
    );
  }

  if (loadError && items === null) {
    return (
      <div className="mt-8 rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="font-semibold text-ink">
          Could not load your appointments
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Check your connection and try again.
        </p>
        <button
          onClick={loadFirstPage}
          className="mt-5 rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="mt-8 space-y-6">
        <div className="h-72 animate-pulse rounded-xl bg-border" />
        <div className="space-y-2">
          <div className="h-16 animate-pulse rounded-lg bg-border" />
          <div className="h-16 animate-pulse rounded-lg bg-border" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-lg font-semibold text-ink">No appointments yet</p>
        <p className="mt-1 text-sm text-ink-muted">
          Find a doctor and book your first visit.
        </p>
        <Link
          href="/doctors"
          className="mt-6 inline-block rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          Find a doctor
        </Link>
      </div>
    );
  }

  const next = upcoming.find(item => item.status === 'BOOKED') ?? null;
  const rest = upcoming.filter(item => item !== next);
  const historyTotal = Math.max(history.length, total - upcoming.length);
  const bannerMessage =
    actionError ?? (loadError ? 'Could not refresh your appointments.' : null);

  return (
    <div className="mt-8 space-y-10">
      {bannerMessage && (
        <p
          role="alert"
          className="rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red"
        >
          {bannerMessage}
        </p>
      )}

      {next ? (
        <NextAppointmentCard
          appointment={next}
          nowMs={nowMs}
          canModify={canModify(next)}
          onCancel={() => setCancelTarget(next)}
        />
      ) : (
        <div className="rounded-xl border border-dashed border-border px-6 py-12 text-center">
          <p className="font-semibold text-ink">No upcoming appointments</p>
          <p className="mt-1 text-sm text-ink-muted">
            Find a doctor and book your next visit.
          </p>
          <Link
            href="/doctors"
            className="mt-5 inline-block rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Find a doctor
          </Link>
        </div>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-ink-muted">
            Also upcoming
          </h2>
          <div className="mt-3 space-y-2">
            {rest.map(item => (
              <AppointmentRow
                key={item.id}
                appointment={item}
                actions={
                  canModify(item) ? (
                    <>
                      <Link
                        href={`/appointments/${item.id}/reschedule`}
                        className={ROW_BUTTON}
                      >
                        Reschedule
                      </Link>
                      <button
                        onClick={() => setCancelTarget(item)}
                        className={ROW_DANGER}
                      >
                        Cancel
                      </button>
                    </>
                  ) : null
                }
              />
            ))}
          </div>
        </section>
      )}

      {history.length > 0 && (
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-border bg-surface px-5 py-4 text-sm font-semibold text-ink transition-colors hover:border-primary [&::-webkit-details-marker]:hidden">
            <span>Past and cancelled</span>
            <span className="flex items-center gap-3">
              <span className="font-mono text-ink-muted">{historyTotal}</span>
              <ChevronDown className="h-4 w-4 text-ink-muted transition-transform group-open:rotate-180" />
            </span>
          </summary>

          <div className="mt-3 space-y-2">
            {history.map(item => (
              <AppointmentRow
                key={item.id}
                appointment={item}
                actions={
                  <Link
                    href={`/doctors/${item.doctor.id}`}
                    className={ROW_BUTTON}
                  >
                    Book again
                  </Link>
                }
              />
            ))}
          </div>

          {page < totalPages && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-4 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Show older appointments'}
            </button>
          )}
        </details>
      )}

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancel this appointment?"
        description={
          cancelTarget
            ? `${cancelTarget.doctor.user.name}, ${formatSlotDate(cancelTarget.slotStart)} at ${formatSlotTime(cancelTarget.slotStart)}. Your payment will be refunded to your original payment method.`
            : ''
        }
        confirmLabel="Yes, cancel appointment"
        cancelLabel="Keep appointment"
        loading={cancelling}
        onConfirm={confirmCancel}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}
