'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { FormField } from '@/components/form-field';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { dhakaDateKey, formatDayLabel } from '@/lib/format';
import {
  leaveDaySchema,
  type LeaveDayInput,
} from '@/lib/validators/availability.schema';
import type { LeaveDay } from '@/types/doctor-portal';

function relativeLabel(dateKey: string, today: string): string {
  const diff = Math.round(
    (Date.parse(`${dateKey}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) /
      86_400_000,
  );

  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `In ${diff} days`;
}

export default function LeaveDaysPage() {
  const today = dhakaDateKey(new Date());

  const [days, setDays] = useState<LeaveDay[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<LeaveDay | null>(null);
  const [removing, setRemoving] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [bookingConflict, setBookingConflict] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeaveDayInput>({ resolver: zodResolver(leaveDaySchema) });

  const load = useCallback(async () => {
    setLoadError(false);

    try {
      const response = await apiFetch('/api/doctors/me/exceptions');

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setDays(await response.json());
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onSubmit(values: LeaveDayInput) {
    setServerError(null);
    setBookingConflict(false);

    try {
      const response = await apiFetch('/api/doctors/me/exceptions', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message =
          typeof data.error === 'string'
            ? data.error
            : 'Could not block this day.';
        setServerError(message);
        setBookingConflict(
          response.status === 409 && /appointment/i.test(message),
        );
        return;
      }

      reset();
      await load();
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  }

  async function confirmRemove() {
    if (!removeTarget) return;

    setRemoving(true);
    setBanner(null);

    try {
      const response = await apiFetch(
        `/api/doctors/me/exceptions/${removeTarget.id}`,
        { method: 'DELETE' },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setBanner(
          typeof data.error === 'string'
            ? data.error
            : 'Could not remove this leave day.',
        );
      } else {
        await load();
      }
    } catch {
      setBanner('Something went wrong. Please try again.');
    } finally {
      setRemoving(false);
      setRemoveTarget(null);
    }
  }

  if (loadError && days === null) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="font-semibold text-ink">Could not load your leave days</p>
        <p className="mt-1 text-sm text-ink-muted">
          Check your connection and try again.
        </p>
        <button onClick={load} className={`${PRIMARY_BUTTON} mt-5`}>
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <section aria-labelledby="leave-heading">
        <h2 id="leave-heading" className="text-sm font-semibold text-ink-muted">
          Upcoming leave days
        </h2>

        {banner && (
          <p
            role="alert"
            className="mt-3 rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red"
          >
            {banner}
          </p>
        )}

        {days === null ? (
          <div className="mt-4 space-y-2">
            <div className="h-16 animate-pulse rounded-lg bg-border" />
            <div className="h-16 animate-pulse rounded-lg bg-border" />
          </div>
        ) : days.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-border px-6 py-14 text-center">
            <p className="text-ink">No upcoming leave days.</p>
            <p className="mt-1 text-sm text-ink-muted">
              Block a day when you are away and patients cannot book it.
            </p>
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {days.map(day => (
              <li
                key={day.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-5 py-4"
              >
                <div>
                  <p className="font-mono text-sm font-semibold text-ink">
                    {formatDayLabel(day.date)}
                  </p>
                  <p className="text-xs text-ink-muted">
                    {relativeLabel(day.date, today)}
                  </p>
                </div>
                <button
                  onClick={() => setRemoveTarget(day)}
                  aria-label={`Remove leave day ${formatDayLabel(day.date)}`}
                  className="rounded-sm p-2 text-ink-muted transition-colors hover:bg-red-tint hover:text-red"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5 rounded-xl border border-border bg-surface p-6 shadow-card"
        >
          <h2 className="text-base font-semibold text-ink">Block a day</h2>

          <FormField
            label="Date"
            type="date"
            min={today}
            hint="A day that already has booked appointments cannot be blocked."
            error={errors.date?.message}
            {...register('date')}
          />

          {serverError && (
            <div
              role="alert"
              className="rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red"
            >
              <p>{serverError}</p>
              {bookingConflict && (
                <Link
                  href="/doctor-portal/appointments"
                  className="mt-1 inline-block font-semibold underline"
                >
                  View your appointments
                </Link>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`${PRIMARY_BUTTON} w-full`}
          >
            {isSubmitting ? 'Blocking...' : 'Block day'}
          </button>
        </form>
      </div>

      <ConfirmDialog
        open={removeTarget !== null}
        title="Remove this leave day?"
        description={
          removeTarget
            ? `Patients will be able to book ${formatDayLabel(removeTarget.date)} again, based on your weekly availability.`
            : ''
        }
        confirmLabel="Remove leave day"
        cancelLabel="Keep it"
        loading={removing}
        onConfirm={confirmRemove}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}
