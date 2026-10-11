'use client';

import { useCallback, useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { formatClock, WEEKDAYS } from '@/lib/schedule';
import { ConfirmDialog } from '@/components/confirm-dialog';
import type { AvailabilityRule } from '@/types/doctor-portal';
import { AddWindowForm } from './add-window-form';

export default function AvailabilityPage() {
  const [rules, setRules] = useState<AvailabilityRule[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<AvailabilityRule | null>(
    null,
  );
  const [removing, setRemoving] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadError(false);

    try {
      const response = await apiFetch('/api/doctors/me/availability');

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setRules(await response.json());
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmRemove() {
    if (!removeTarget) return;

    setRemoving(true);
    setBanner(null);

    try {
      const response = await apiFetch(
        `/api/doctors/me/availability/${removeTarget.id}`,
        { method: 'DELETE' },
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setBanner(
          typeof data.error === 'string'
            ? data.error
            : 'Could not remove this window.',
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

  if (loadError && rules === null) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="font-semibold text-ink">
          Could not load your availability
        </p>
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
      <section aria-labelledby="weekly-heading">
        <h2
          id="weekly-heading"
          className="text-sm font-semibold text-ink-muted"
        >
          Weekly schedule
        </h2>

        {banner && (
          <p
            role="alert"
            className="mt-3 rounded-md border border-red bg-red-tint px-4 py-3 text-sm text-red"
          >
            {banner}
          </p>
        )}

        {rules === null ? (
          <div className="mt-4 h-96 animate-pulse rounded-xl bg-border" />
        ) : (
          <>
            {rules.length === 0 && (
              <p className="mt-4 rounded-md border border-amber bg-amber-tint px-4 py-3 text-sm text-ink">
                You have no availability yet. Patients cannot book you until you
                add at least one window.
              </p>
            )}

            <ul className="mt-4 rounded-xl border border-border bg-surface px-5">
              {WEEKDAYS.map((name, weekday) => {
                const dayRules = rules.filter(rule => rule.weekday === weekday);

                return (
                  <li
                    key={name}
                    className="flex gap-4 border-b border-border py-4 last:border-b-0"
                  >
                    <div className="w-28 shrink-0 pt-2 text-sm font-semibold text-ink">
                      {name}
                    </div>

                    <div className="min-w-0 flex-1 space-y-2">
                      {dayRules.length === 0 ? (
                        <p className="pt-2 text-sm text-ink-muted">
                          Not available
                        </p>
                      ) : (
                        dayRules.map(rule => (
                          <div
                            key={rule.id}
                            className="flex items-center justify-between gap-3 rounded-md bg-primary-tint px-3 py-2"
                          >
                            <div>
                              <p className="font-mono text-sm font-medium text-primary-hover">
                                {formatClock(rule.startTime)} -{' '}
                                {formatClock(rule.endTime)}
                              </p>
                              <p className="text-xs text-ink-muted">
                                {rule.slotDurationMin} min slots
                                {rule.bufferMin > 0
                                  ? `, ${rule.bufferMin} min buffer`
                                  : ''}
                              </p>
                            </div>
                            <button
                              onClick={() => setRemoveTarget(rule)}
                              aria-label={`Remove ${name} ${formatClock(rule.startTime)} to ${formatClock(rule.endTime)}`}
                              className="rounded-sm p-2 text-ink-muted transition-colors hover:bg-red-tint hover:text-red"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      <div className="lg:sticky lg:top-24 lg:h-fit">
        <AddWindowForm onAdded={load} />
      </div>

      <ConfirmDialog
        open={removeTarget !== null}
        title="Remove this window?"
        description={
          removeTarget
            ? `${WEEKDAYS[removeTarget.weekday]}, ${formatClock(removeTarget.startTime)} to ${formatClock(removeTarget.endTime)}. Patients will no longer see these times. Appointments that are already booked are not affected.`
            : ''
        }
        confirmLabel="Remove window"
        cancelLabel="Keep it"
        loading={removing}
        onConfirm={confirmRemove}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}
