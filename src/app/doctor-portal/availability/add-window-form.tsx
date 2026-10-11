'use client';

import { useState } from 'react';
import { FormField } from '@/components/form-field';
import { FormSelect } from '@/components/form-select';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { countSlots, SHORT_WEEKDAYS, WEEKDAYS } from '@/lib/schedule';
import { availabilityFormSchema } from '@/lib/validators/availability.schema';

const SLOT_OPTIONS = [15, 20, 30, 45, 60];
const BUFFER_OPTIONS = [0, 5, 10, 15];

interface Notice {
  tone: 'success' | 'warning';
  text: string;
}

export function AddWindowForm({ onAdded }: { onAdded: () => void }) {
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('13:00');
  const [slotDurationMin, setSlotDurationMin] = useState(30);
  const [bufferMin, setBufferMin] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState<Notice | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function toggleDay(day: number) {
    setWeekdays(current =>
      current.includes(day)
        ? current.filter(item => item !== day)
        : [...current, day].sort((a, b) => a - b),
    );
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setNotice(null);

    const parsed = availabilityFormSchema.safeParse({
      weekdays,
      startTime,
      endTime,
      slotDurationMin,
      bufferMin,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >;
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0] ?? '',
          ]),
        ),
      );
      return;
    }

    setErrors({});
    setSubmitting(true);

    const added: number[] = [];
    const failed: { weekday: number; reason: string }[] = [];

    for (const weekday of parsed.data.weekdays) {
      try {
        const response = await apiFetch('/api/doctors/me/availability', {
          method: 'POST',
          body: JSON.stringify({
            weekday,
            startTime,
            endTime,
            slotDurationMin,
            bufferMin,
          }),
        });

        if (response.ok) {
          added.push(weekday);
          continue;
        }

        const data = await response.json().catch(() => ({}));
        failed.push({
          weekday,
          reason:
            typeof data.error === 'string' ? data.error : 'could not be saved',
        });
      } catch {
        failed.push({ weekday, reason: 'network error' });
      }
    }

    setSubmitting(false);

    if (added.length > 0) {
      onAdded();
    }

    if (failed.length === 0) {
      setWeekdays([]);
      setNotice({
        tone: 'success',
        text: `Added ${added.length} ${added.length === 1 ? 'day' : 'days'}.`,
      });
      return;
    }

    setWeekdays(failed.map(item => item.weekday));

    const addedText =
      added.length > 0
        ? `Added ${added.map(day => SHORT_WEEKDAYS[day]).join(', ')}. `
        : '';
    const failedText = failed
      .map(item => `${SHORT_WEEKDAYS[item.weekday]} (${item.reason})`)
      .join('; ');

    setNotice({
      tone: 'warning',
      text: `${addedText}Could not add: ${failedText}.`,
    });
  }

  const slotCount = countSlots(startTime, endTime, slotDurationMin, bufferMin);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-xl border border-border bg-surface p-6 shadow-card"
    >
      <h2 className="text-base font-semibold text-ink">Add a window</h2>

      <fieldset>
        <legend className="text-sm font-medium text-ink">Days</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {SHORT_WEEKDAYS.map((label, day) => {
            const active = weekdays.includes(day);

            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleDay(day)}
                aria-pressed={active}
                aria-label={WEEKDAYS[day]}
                className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-surface text-ink hover:border-primary'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {errors.weekdays && (
          <p role="alert" className="mt-1.5 text-sm text-red">
            {errors.weekdays}
          </p>
        )}
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="Start"
          type="time"
          value={startTime}
          onChange={event => setStartTime(event.target.value)}
          error={errors.startTime}
        />
        <FormField
          label="End"
          type="time"
          value={endTime}
          onChange={event => setEndTime(event.target.value)}
          error={errors.endTime}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormSelect
          label="Slot length"
          value={slotDurationMin}
          onChange={event => setSlotDurationMin(Number(event.target.value))}
          error={errors.slotDurationMin}
        >
          {SLOT_OPTIONS.map(minutes => (
            <option key={minutes} value={minutes}>
              {minutes} min
            </option>
          ))}
        </FormSelect>

        <FormSelect
          label="Buffer"
          value={bufferMin}
          onChange={event => setBufferMin(Number(event.target.value))}
          error={errors.bufferMin}
        >
          {BUFFER_OPTIONS.map(minutes => (
            <option key={minutes} value={minutes}>
              {minutes === 0 ? 'None' : `${minutes} min`}
            </option>
          ))}
        </FormSelect>
      </div>

      <div className="space-y-1 text-xs text-ink-muted">
        {slotCount > 0 && (
          <p>
            About {slotCount} {slotCount === 1 ? 'slot' : 'slots'} per day on
            each selected day.
          </p>
        )}
        <p>Times are in Bangladesh time (Asia/Dhaka).</p>
      </div>

      {notice && (
        <p
          role={notice.tone === 'warning' ? 'alert' : 'status'}
          className={`rounded-md border px-4 py-3 text-sm ${
            notice.tone === 'warning'
              ? 'border-amber bg-amber-tint text-ink'
              : 'border-primary bg-primary-tint text-primary-hover'
          }`}
        >
          {notice.text}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className={`${PRIMARY_BUTTON} w-full`}
      >
        {submitting ? 'Adding...' : 'Add window'}
      </button>
    </form>
  );
}
