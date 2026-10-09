'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { signInHref } from '@/lib/auth-redirect';
import {
  chipDateLabel,
  dhakaDateKey,
  formatDayLabel,
  formatSlotTime,
  getDhakaHour,
} from '@/lib/format';
import { useMe } from '@/lib/use-me';
import type { DaySlots, Slot } from '@/types/availability';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function addDaysToKey(dateKey: string, amount: number): string {
  const d = new Date(`${dateKey}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + amount);
  return d.toISOString().slice(0, 10);
}

function groupByPeriod(slots: Slot[]) {
  const morning: Slot[] = [];
  const afternoon: Slot[] = [];
  const evening: Slot[] = [];

  for (const slot of slots) {
    const hour = getDhakaHour(slot.start);
    if (hour < 12) morning.push(slot);
    else if (hour < 17) afternoon.push(slot);
    else evening.push(slot);
  }

  return [
    { label: 'Morning', slots: morning },
    { label: 'Afternoon', slots: afternoon },
    { label: 'Evening', slots: evening },
  ].filter(group => group.slots.length > 0);
}

export function SlotPicker({
  doctorId,
  consultationFee,
}: {
  doctorId: string;
  consultationFee: number;
}) {
  const { me, loading: authLoading } = useMe();
  const router = useRouter();
  const today = dhakaDateKey(new Date());

  const [windowStart, setWindowStart] = useState(today);
  const [days, setDays] = useState<DaySlots[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setSelectedSlot(null);
      setActiveDateIndex(0);

      const from = windowStart;
      const to = addDaysToKey(windowStart, 6);
      const response = await fetch(
        `${API_URL}/api/doctors/${doctorId}/availability?from=${from}&to=${to}`,
      );
      const data: DaySlots[] = await response.json();
      setDays(data);
      setLoading(false);
    }

    load();
  }, [doctorId, windowStart]);

  async function confirmBooking() {
    if (!selectedSlot || authLoading) return;

    setError(null);

    if (!me) {
      router.push(
        signInHref(`${window.location.pathname}${window.location.search}`),
      );
      return;
    }

    setConfirming(true);

    try {
      const response = await apiFetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ doctorId, slotStart: selectedSlot.start }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'This slot is no longer available.');
        setConfirming(false);
        setSelectedSlot(null);
        setSheetOpen(false);
        const from = windowStart;
        const to = addDaysToKey(windowStart, 6);
        const refreshed = await fetch(
          `${API_URL}/api/doctors/${doctorId}/availability?from=${from}&to=${to}`,
        );
        setDays(await refreshed.json());
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError('Something went wrong. Please try again.');
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-6 space-y-3">
        <div className="h-12 animate-pulse rounded-md bg-border" />
        <div className="h-24 animate-pulse rounded-md bg-border" />
      </div>
    );
  }

  const activeDay = days[activeDateIndex];
  const periods = activeDay ? groupByPeriod(activeDay.slots) : [];
  const atEarliestWeek = windowStart <= today;

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_320px]">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Choose a date
        </h3>

        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() =>
              setWindowStart(w =>
                addDaysToKey(w, -7) < today ? today : addDaysToKey(w, -7),
              )
            }
            disabled={atEarliestWeek}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-muted"
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex flex-1 gap-2 overflow-hidden">
            {days.map((day, i) => {
              const label = chipDateLabel(day.date, today);
              return (
                <button
                  key={day.date}
                  onClick={() => setActiveDateIndex(i)}
                  className={`flex-1 rounded-md border px-1 py-2 text-center transition-colors ${
                    i === activeDateIndex
                      ? 'border-primary bg-primary-tint text-primary-hover'
                      : 'border-border bg-surface text-ink hover:border-primary'
                  }`}
                >
                  <div className="text-[11px] text-ink-muted">{label.top}</div>
                  <div className="mt-0.5 font-mono text-sm font-semibold">
                    {label.bottom}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setWindowStart(w => addDaysToKey(w, 7))}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-primary hover:text-primary"
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-primary hover:text-primary">
            <Calendar className="h-4 w-4" />
            <input
              type="date"
              min={today}
              onChange={e => {
                if (e.target.value && e.target.value >= today)
                  setWindowStart(e.target.value);
              }}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Jump to date"
            />
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {periods.length === 0 && (
            <p className="text-sm text-ink-muted">No open slots this day.</p>
          )}

          {periods.map(period => (
            <div key={period.label}>
              <div className="mb-2 text-sm text-ink-muted">{period.label}</div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {period.slots.map(slot => (
                  <button
                    key={slot.start}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setError(null);
                    }}
                    className={`rounded-md border px-2 py-2.5 font-mono text-sm font-medium transition-colors ${
                      selectedSlot?.start === slot.start
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-surface text-ink hover:border-primary'
                    }`}
                  >
                    {formatSlotTime(slot.start)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="mt-4 text-sm text-red">{error}</p>}
      </div>

      <div className="sticky top-24 hidden h-fit rounded-lg border border-border bg-surface p-6 md:block">
        <h3 className="font-display text-sm font-semibold text-ink">
          Your appointment
        </h3>
        {!selectedSlot ? (
          <p className="mt-3 text-sm text-ink-muted">
            Select a time to continue.
          </p>
        ) : (
          <div className="mt-4">
            <SummaryRows
              date={formatDayLabel(activeDay?.date ?? today)}
              time={formatSlotTime(selectedSlot.start)}
              fee={consultationFee}
            />
            <button
              onClick={confirmBooking}
              disabled={confirming}
              className="mt-4 w-full rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {confirming ? 'Processing...' : 'Confirm & Pay'}
            </button>
          </div>
        )}
      </div>

      {selectedSlot && (
        <button
          onClick={() => setSheetOpen(true)}
          className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-lg bg-primary px-5 py-3.5 text-white shadow-card md:hidden"
        >
          <span className="text-sm">
            Selected &middot;{' '}
            <span className="font-mono font-semibold">
              {formatSlotTime(selectedSlot.start)}
            </span>
          </span>
          <span className="rounded-sm bg-white/20 px-3 py-1.5 text-xs font-semibold">
            Review &amp; Pay
          </span>
        </button>
      )}

      {sheetOpen && selectedSlot && (
        <>
          <div
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-surface p-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] md:hidden">
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
            <h3 className="font-display text-base font-semibold text-ink">
              Confirm your appointment
            </h3>
            <div className="mt-4">
              <SummaryRows
                date={formatDayLabel(activeDay?.date ?? today)}
                time={formatSlotTime(selectedSlot.start)}
                fee={consultationFee}
              />
            </div>
            <button
              onClick={confirmBooking}
              disabled={confirming}
              className="mt-4 w-full rounded-sm bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
            >
              {confirming ? 'Processing...' : 'Confirm & Pay'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryRows({
  date,
  time,
  fee,
}: {
  date: string;
  time: string;
  fee: number;
}) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between border-b border-border pb-2">
        <dt className="text-ink-muted">Date</dt>
        <dd className="font-medium text-ink">{date}</dd>
      </div>
      <div className="flex justify-between border-b border-border pb-2">
        <dt className="text-ink-muted">Time</dt>
        <dd className="font-mono font-medium text-ink">{time}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-ink-muted">Price</dt>
        <dd className="font-mono font-medium text-ink">${fee}</dd>
      </div>
    </dl>
  );
}
