'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Clock, XCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON, SECONDARY_LINK } from '@/lib/button-styles';
import { formatDayLabel, formatSlotDate, formatSlotTime } from '@/lib/format';
import { CHANGE_CUTOFF_MS } from '@/lib/policy';
import { useNow } from '@/lib/use-now';
import { SlotConfirmPanel } from '@/components/slot-confirm-panel';
import { SlotSelector, type SlotSelection } from '@/components/slot-selector';
import { StateCard } from '@/components/state-card';
import type { AppointmentDetail } from '@/types/appointment';

const BLOCKED_COPY: Partial<
  Record<AppointmentDetail['status'], { title: string; body: string }>
> = {
  PENDING_PAYMENT: {
    title: 'Payment is not complete yet',
    body: 'Finish paying for this booking first. You can change the time once it is confirmed.',
  },
  CANCELLED: {
    title: 'This appointment was cancelled',
    body: 'A cancelled appointment cannot be rescheduled. Book a new time instead.',
  },
  COMPLETED: {
    title: 'This visit has already taken place',
    body: 'Completed appointments cannot be rescheduled.',
  },
  NO_SHOW: {
    title: 'This visit has already taken place',
    body: 'Missed appointments cannot be rescheduled.',
  },
};

export function ReschedulePicker({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const nowMs = useNow();

  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null,
  );
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await apiFetch(`/api/appointments/${appointmentId}`);

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const data: AppointmentDetail = await response.json();

        if (!cancelled) {
          setAppointment(data);
          setLoadError(false);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [appointmentId, retryKey]);

  async function confirmReschedule() {
    if (!selection || saving) return;

    setError(null);
    setSaving(true);

    try {
      const response = await apiFetch(
        `/api/appointments/${appointmentId}/reschedule`,
        {
          method: 'PATCH',
          body: JSON.stringify({ slotStart: selection.slot.start }),
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : 'Could not reschedule this appointment.',
        );
        setSelection(null);
        setRefreshKey(key => key + 1);
        setSaving(false);
        return;
      }

      router.push(`/appointments/${data.id}`);
    } catch {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  if (loadError && !appointment) {
    return (
      <StateCard
        icon={AlertCircle}
        tone="red"
        title="Could not load this appointment"
      >
        <p>Check your connection and try again.</p>
        <button
          onClick={() => setRetryKey(key => key + 1)}
          className={PRIMARY_BUTTON}
        >
          Try again
        </button>
      </StateCard>
    );
  }

  if (!appointment) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-40 animate-pulse rounded-md bg-border" />
        <div className="h-10 w-72 animate-pulse rounded-md bg-border" />
        <div className="h-20 animate-pulse rounded-lg bg-border" />
        <div className="h-64 animate-pulse rounded-lg bg-border" />
      </div>
    );
  }

  const blocked = BLOCKED_COPY[appointment.status];

  if (blocked) {
    const pending = appointment.status === 'PENDING_PAYMENT';

    return (
      <StateCard
        icon={pending ? Clock : XCircle}
        tone={pending ? 'amber' : 'red'}
        title={blocked.title}
      >
        <p>{blocked.body}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {pending ? (
            <Link
              href={`/appointments/${appointment.id}`}
              className={PRIMARY_BUTTON}
            >
              Go to payment
            </Link>
          ) : (
            <Link
              href={`/doctors/${appointment.doctorId}`}
              className={PRIMARY_BUTTON}
            >
              Book a new time
            </Link>
          )}
          <Link href="/dashboard" className={SECONDARY_LINK}>
            Your appointments
          </Link>
        </div>
      </StateCard>
    );
  }

  const startMs = new Date(appointment.slotStart).getTime();

  if (startMs - nowMs <= CHANGE_CUTOFF_MS) {
    return (
      <StateCard
        icon={Clock}
        tone="amber"
        title="Changes are closed for this visit"
      >
        <p>
          Appointments can be changed up to {CHANGE_CUTOFF_MS / 3_600_000} hours
          before they start. This one starts{' '}
          {formatSlotDate(appointment.slotStart)} at{' '}
          {formatSlotTime(appointment.slotStart)}.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/appointments/${appointment.id}`}
            className={PRIMARY_BUTTON}
          >
            View details
          </Link>
          <Link href="/dashboard" className={SECONDARY_LINK}>
            Your appointments
          </Link>
        </div>
      </StateCard>
    );
  }

  const currentLabel = `${formatSlotDate(appointment.slotStart)}, ${formatSlotTime(appointment.slotStart)}`;

  const rows = selection
    ? [
        { label: 'Doctor', value: appointment.doctor.user.name },
        { label: 'Current', value: currentLabel, mono: true },
        {
          label: 'New',
          value: `${formatDayLabel(selection.dateKey)}, ${formatSlotTime(selection.slot.start)}`,
          mono: true,
        },
      ]
    : [];

  return (
    <div>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Your appointments
      </Link>

      <h1 className="mt-4 text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Reschedule appointment
      </h1>
      <p className="mt-2 text-ink-muted">
        Choose a new time with {appointment.doctor.user.name}. Your current time
        is released once you confirm.
      </p>

      <div className="mt-8 flex flex-col gap-1 rounded-lg border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-ink-muted">Currently booked</p>
          <p className="mt-0.5 font-mono text-sm font-semibold text-ink">
            {currentLabel}
          </p>
        </div>
        <p className="text-sm text-ink-muted">
          {appointment.doctor.specialty} &middot;{' '}
          {appointment.doctor.clinic.name}
        </p>
      </div>

      <div className="mt-10 grid gap-10 md:grid-cols-[1fr_320px]">
        <div>
          <SlotSelector
            doctorId={appointment.doctorId}
            selectedStart={selection?.slot.start ?? null}
            refreshKey={refreshKey}
            onSelect={value => {
              setSelection(value);
              if (value) setError(null);
            }}
          />

          {error && (
            <p role="alert" className="mt-4 text-sm text-red">
              {error}
            </p>
          )}
        </div>

        <SlotConfirmPanel
          heading="Your new time"
          sheetHeading="Confirm your new time"
          emptyText="Select a new time to continue."
          barLabel={selection ? formatSlotTime(selection.slot.start) : null}
          barAction="Review"
          rows={rows}
          note="No extra charge. Your payment moves to the new time."
          confirmLabel="Confirm new time"
          confirmingLabel="Rescheduling..."
          confirming={saving}
          onConfirm={confirmReschedule}
        />
      </div>
    </div>
  );
}
