'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { addDaysToKey } from '@/lib/date-keys';
import {
  dhakaDateKey,
  formatDayLabel,
  formatSlotDate,
  formatSlotTime,
} from '@/lib/format';
import { useNow } from '@/lib/use-now';
import { usePagedList } from '@/lib/use-paged-list';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { DoctorAppointment } from '@/types/doctor-portal';
import { DoctorAppointmentRow } from './doctor-appointment-row';

const LIST_PATH = '/api/doctors/me/appointments?scope=schedule&pageSize=50';

const SMALL_PRIMARY =
  'rounded-sm bg-primary px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-hover active:scale-[0.97] disabled:opacity-50';
const SMALL_SECONDARY =
  'rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-paper disabled:opacity-50';
const SMALL_DANGER =
  'rounded-sm px-3 py-1.5 text-xs font-semibold text-red transition-colors hover:bg-red-tint disabled:opacity-50';

export function ScheduleView() {
  const nowMs = useNow();
  const { items, error, loadingMore, hasMore, reload, loadMore } =
    usePagedList<DoctorAppointment>(LIST_PATH);

  const [actioningId, setActioningId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [noShowTarget, setNoShowTarget] = useState<DoctorAppointment | null>(
    null,
  );
  const [cancelTarget, setCancelTarget] = useState<DoctorAppointment | null>(
    null,
  );

  const todayKey = dhakaDateKey(new Date(nowMs));
  const tomorrowKey = addDaysToKey(todayKey, 1);

  const { finished, groups } = useMemo(() => {
    const list = items ?? [];
    const ended = list.filter(
      item => new Date(item.slotEnd).getTime() <= nowMs,
    );
    const upcoming = list.filter(
      item => new Date(item.slotEnd).getTime() > nowMs,
    );

    const byDay = new Map<string, DoctorAppointment[]>();

    for (const item of upcoming) {
      const key = dhakaDateKey(new Date(item.slotStart));
      byDay.set(key, [...(byDay.get(key) ?? []), item]);
    }

    return { finished: ended, groups: [...byDay.entries()] };
  }, [items, nowMs]);

  async function runAction(
    appointment: DoctorAppointment,
    path: string,
    body: object | null,
    fallback: string,
  ) {
    setActioningId(appointment.id);
    setActionError(null);

    try {
      const response = await apiFetch(
        `/api/doctors/me/appointments/${appointment.id}/${path}`,
        {
          method: 'PATCH',
          ...(body ? { body: JSON.stringify(body) } : {}),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setActionError(typeof data.error === 'string' ? data.error : fallback);
        return;
      }

      await reload();
    } catch {
      setActionError('Something went wrong. Please try again.');
    } finally {
      setActioningId(null);
    }
  }

  function updateStatus(
    appointment: DoctorAppointment,
    status: 'COMPLETED' | 'NO_SHOW',
  ) {
    return runAction(
      appointment,
      'status',
      { status },
      'Could not update this appointment.',
    );
  }

  async function confirmNoShow() {
    if (!noShowTarget) return;

    await updateStatus(noShowTarget, 'NO_SHOW');
    setNoShowTarget(null);
  }

  async function confirmCancel() {
    if (!cancelTarget) return;

    await runAction(
      cancelTarget,
      'cancel',
      null,
      'Could not cancel this appointment.',
    );
    setCancelTarget(null);
  }

  function actionsFor(appointment: DoctorAppointment) {
    const busy = actioningId === appointment.id;

    if (new Date(appointment.slotStart).getTime() > nowMs) {
      return (
        <button
          onClick={() => setCancelTarget(appointment)}
          disabled={busy}
          className={SMALL_DANGER}
        >
          Cancel
        </button>
      );
    }

    const inProgress = new Date(appointment.slotEnd).getTime() > nowMs;

    return (
      <>
        {inProgress && (
          <span className="rounded-full bg-amber-tint px-3 py-1 text-xs font-semibold text-amber">
            In progress
          </span>
        )}
        <button
          onClick={() => updateStatus(appointment, 'COMPLETED')}
          disabled={busy}
          className={SMALL_PRIMARY}
        >
          Completed
        </button>
        <button
          onClick={() => setNoShowTarget(appointment)}
          disabled={busy}
          className={SMALL_SECONDARY}
        >
          No show
        </button>
      </>
    );
  }

  if (error && items === null) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="font-semibold text-ink">Could not load your schedule</p>
        <p className="mt-1 text-sm text-ink-muted">
          Check your connection and try again.
        </p>
        <button onClick={reload} className={`${PRIMARY_BUTTON} mt-5`}>
          Try again
        </button>
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="space-y-2">
        <div className="h-16 animate-pulse rounded-lg bg-border" />
        <div className="h-16 animate-pulse rounded-lg bg-border" />
        <div className="h-16 animate-pulse rounded-lg bg-border" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-lg font-semibold text-ink">
          No upcoming appointments
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Patients can book you once your availability is set.
        </p>
        <Link
          href="/doctor-portal/availability"
          className={`${PRIMARY_BUTTON} mt-6`}
        >
          Set your availability
        </Link>
      </div>
    );
  }

  const noShowBusy = noShowTarget !== null && actioningId === noShowTarget.id;
  const cancelBusy = cancelTarget !== null && actioningId === cancelTarget.id;

  return (
    <div className="space-y-10">
      {(actionError || error) && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red"
        >
          <p>{actionError ?? 'Could not refresh your schedule.'}</p>
          <button onClick={reload} className="font-semibold underline">
            Try again
          </button>
        </div>
      )}

      {finished.length > 0 && (
        <section aria-labelledby="needs-update-heading">
          <h2
            id="needs-update-heading"
            className="flex items-center gap-2 text-sm font-semibold text-ink"
          >
            Needs your update
            <span className="rounded-full bg-amber-tint px-2 py-0.5 font-mono text-xs text-amber">
              {finished.length}
            </span>
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            These visits have ended. Mark whether the patient attended.
          </p>

          <div className="mt-3 space-y-2">
            {finished.map(appointment => (
              <DoctorAppointmentRow
                key={appointment.id}
                appointment={appointment}
                showDate
                actions={actionsFor(appointment)}
              />
            ))}
          </div>
        </section>
      )}

      {groups.map(([dateKey, list]) => {
        const relative =
          dateKey === todayKey
            ? 'Today'
            : dateKey === tomorrowKey
              ? 'Tomorrow'
              : null;

        return (
          <section
            key={dateKey}
            aria-label={relative ?? formatDayLabel(dateKey)}
          >
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-ink">
                {relative ?? formatDayLabel(dateKey)}
                {relative && (
                  <span className="ml-2 font-normal text-ink-muted">
                    {formatDayLabel(dateKey)}
                  </span>
                )}
              </h2>
              <span className="text-xs text-ink-muted">
                {list.length}{' '}
                {list.length === 1 ? 'appointment' : 'appointments'}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {list.map(appointment => (
                <DoctorAppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  actions={actionsFor(appointment)}
                />
              ))}
            </div>
          </section>
        );
      })}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loadingMore}
          className="rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary disabled:opacity-50"
        >
          {loadingMore ? 'Loading...' : 'Show more'}
        </button>
      )}

      <ConfirmDialog
        open={noShowTarget !== null}
        title="Mark as no-show?"
        description={
          noShowTarget
            ? `${noShowTarget.patient.name} did not attend on ${formatSlotDate(noShowTarget.slotStart)} at ${formatSlotTime(noShowTarget.slotStart)}. This cannot be undone, and no refund is issued.`
            : ''
        }
        confirmLabel="Mark as no-show"
        cancelLabel="Cancel"
        loading={noShowBusy}
        onConfirm={confirmNoShow}
        onClose={() => setNoShowTarget(null)}
      />

      <ConfirmDialog
        open={cancelTarget !== null}
        title="Cancel this appointment?"
        description={
          cancelTarget
            ? `${cancelTarget.patient.name}, ${formatSlotDate(cancelTarget.slotStart)} at ${formatSlotTime(cancelTarget.slotStart)}. The patient is refunded in full and notified by email. This cannot be undone.`
            : ''
        }
        confirmLabel="Cancel appointment"
        cancelLabel="Keep appointment"
        loading={cancelBusy}
        onConfirm={confirmCancel}
        onClose={() => setCancelTarget(null)}
      />
    </div>
  );
}
