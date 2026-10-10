'use client';

import { useEffect, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import {
  chipDateLabel,
  dhakaDateKey,
  formatSlotTime,
  getDhakaHour,
} from '@/lib/format';
import type { DaySlots, Slot } from '@/types/availability';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const WINDOW_DAYS = 7;
const NAV_BUTTON =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border text-ink-muted transition-colors hover:border-primary hover:text-primary disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-muted';

export interface SlotSelection {
  slot: Slot;
  dateKey: string;
}

interface SlotSelectorProps {
  doctorId: string;
  selectedStart: string | null;
  refreshKey: number;
  onSelect: (selection: SlotSelection | null) => void;
}

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

export function SlotSelector({
  doctorId,
  selectedStart,
  refreshKey,
  onSelect,
}: SlotSelectorProps) {
  const today = dhakaDateKey(new Date());

  const [windowStart, setWindowStart] = useState(today);
  const [days, setDays] = useState<DaySlots[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(false);

      try {
        const to = addDaysToKey(windowStart, WINDOW_DAYS - 1);
        const response = await fetch(
          `${API_URL}/api/doctors/${doctorId}/availability?from=${windowStart}&to=${to}`,
        );

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const data: DaySlots[] = await response.json();

        if (cancelled) return;

        setDays(data);
        setActiveIndex(previous => {
          if (data[previous]?.slots.length) return previous;
          return Math.max(
            0,
            data.findIndex(day => day.slots.length > 0),
          );
        });
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [doctorId, windowStart, refreshKey, retryKey]);

  function goToWindow(requested: string) {
    const next = requested < today ? today : requested;

    if (next === windowStart) return;

    setWindowStart(next);
    setActiveIndex(0);
    onSelect(null);
  }

  if (loadError) {
    return (
      <div className="rounded-lg border border-border bg-surface px-6 py-10 text-center">
        <p className="font-semibold text-ink">Could not load available times</p>
        <p className="mt-1 text-sm text-ink-muted">
          Check your connection and try again.
        </p>
        <button
          onClick={() => setRetryKey(key => key + 1)}
          className={`${PRIMARY_BUTTON} mt-5`}
        >
          Try again
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-12 animate-pulse rounded-md bg-border" />
        <div className="h-24 animate-pulse rounded-md bg-border" />
      </div>
    );
  }

  const activeDay = days[activeIndex];
  const periods = activeDay ? groupByPeriod(activeDay.slots) : [];
  const weekHasSlots = days.some(day => day.slots.length > 0);
  const atEarliestWeek = windowStart <= today;

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">
        Choose a date
      </h3>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => goToWindow(addDaysToKey(windowStart, -WINDOW_DAYS))}
          disabled={atEarliestWeek}
          className={NAV_BUTTON}
          aria-label="Previous week"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 gap-2 overflow-hidden">
          {days.map((day, index) => {
            const label = chipDateLabel(day.date, today);
            const active = index === activeIndex;
            const hasSlots = day.slots.length > 0;

            let tone =
              'border-border bg-paper text-ink-muted hover:border-primary';
            if (hasSlots)
              tone = 'border-border bg-surface text-ink hover:border-primary';
            if (active)
              tone = 'border-primary bg-primary-tint text-primary-hover';

            return (
              <button
                key={day.date}
                onClick={() => setActiveIndex(index)}
                aria-pressed={active}
                className={`flex-1 rounded-md border px-1 py-2 text-center transition-colors ${tone}`}
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
          onClick={() => goToWindow(addDaysToKey(windowStart, WINDOW_DAYS))}
          className={NAV_BUTTON}
          aria-label="Next week"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className={`relative ${NAV_BUTTON}`}>
          <Calendar className="h-4 w-4" />
          <input
            type="date"
            min={today}
            onChange={event => {
              if (event.target.value) goToWindow(event.target.value);
            }}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label="Jump to date"
          />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {periods.length === 0 && (
          <div className="rounded-lg border border-dashed border-border px-5 py-8 text-center">
            <p className="text-sm text-ink">
              {weekHasSlots
                ? 'No open times on this day.'
                : 'No open times this week.'}
            </p>
            {!weekHasSlots && (
              <button
                onClick={() =>
                  goToWindow(addDaysToKey(windowStart, WINDOW_DAYS))
                }
                className="mt-2 text-sm font-semibold text-primary hover:underline"
              >
                Check next week
              </button>
            )}
          </div>
        )}

        {periods.map(period => (
          <div key={period.label}>
            <div className="mb-2 text-sm text-ink-muted">{period.label}</div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {period.slots.map(slot => {
                const selected = selectedStart === slot.start;

                return (
                  <button
                    key={slot.start}
                    onClick={() =>
                      activeDay && onSelect({ slot, dateKey: activeDay.date })
                    }
                    aria-pressed={selected}
                    className={`rounded-md border px-2 py-2.5 font-mono text-sm font-medium transition-colors ${
                      selected
                        ? 'border-primary bg-primary text-white'
                        : 'border-border bg-surface text-ink hover:border-primary'
                    }`}
                  >
                    {formatSlotTime(slot.start)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
