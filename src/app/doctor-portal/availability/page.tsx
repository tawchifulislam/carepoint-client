'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch } from '@/lib/api';
import {
  CreateAvailabilityInput,
  createAvailabilitySchema,
} from '@/lib/validators/availability.schema';

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

interface AvailabilityRule {
  id: string;
  weekday: number;
  startTime: string;
  endTime: string;
  slotDurationMin: number;
  bufferMin: number;
}

export default function AvailabilityPage() {
  const [rules, setRules] = useState<AvailabilityRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateAvailabilityInput>({
    resolver: zodResolver(createAvailabilitySchema),
    defaultValues: { bufferMin: 0, slotDurationMin: 30 },
  });

  async function load() {
    const response = await apiFetch('/api/doctors/me/availability');
    setRules(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(values: CreateAvailabilityInput) {
    setServerError(null);

    const response = await apiFetch('/api/doctors/me/availability', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok) {
      setServerError(
        typeof data.error === 'string'
          ? data.error
          : 'Could not save this rule.',
      );
      return;
    }

    reset({
      bufferMin: 0,
      slotDurationMin: 30,
      weekday: undefined,
      startTime: '',
      endTime: '',
    });
    await load();
  }

  async function deleteRule(id: string) {
    await apiFetch(`/api/doctors/me/availability/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px]">
      <div>
        {loading ? (
          <p className="text-ink-muted">Loading...</p>
        ) : rules.length === 0 ? (
          <p className="text-ink-muted">No availability rules yet.</p>
        ) : (
          <div className="space-y-2">
            {rules.map(rule => (
              <div
                key={rule.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface p-4 shadow-card"
              >
                <div>
                  <p className="font-medium text-ink">
                    {WEEKDAYS[rule.weekday]}
                  </p>
                  <p className="font-mono text-sm text-ink-muted">
                    {rule.startTime} - {rule.endTime} &middot;{' '}
                    {rule.slotDurationMin}min slots
                    {rule.bufferMin > 0 && `, ${rule.bufferMin}min buffer`}
                  </p>
                </div>
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="text-sm text-red hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="h-fit space-y-3 rounded-md border border-border bg-surface p-5 shadow-card"
      >
        <h2 className="font-display text-sm font-semibold text-ink">
          Add a rule
        </h2>

        <div>
          <label className="text-sm text-ink-muted">Day</label>
          <select
            {...register('weekday', { valueAsNumber: true })}
            className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value="">Select a day</option>
            {WEEKDAYS.map((day, i) => (
              <option key={day} value={i}>
                {day}
              </option>
            ))}
          </select>
          {errors.weekday && (
            <p className="mt-1 text-sm text-red">Select a day</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-ink-muted">Start</label>
            <input
              type="time"
              {...register('startTime')}
              className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
            />
          </div>
          <div>
            <label className="text-sm text-ink-muted">End</label>
            <input
              type="time"
              {...register('endTime')}
              className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
            />
          </div>
        </div>
        {(errors.startTime || errors.endTime) && (
          <p className="text-sm text-red">Enter valid start and end times</p>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-ink-muted">Slot length (min)</label>
            <input
              type="number"
              {...register('slotDurationMin', { valueAsNumber: true })}
              className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
            />
          </div>
          <div>
            <label className="text-sm text-ink-muted">Buffer (min)</label>
            <input
              type="number"
              {...register('bufferMin', { valueAsNumber: true })}
              className="mt-1 w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
            />
          </div>
        </div>

        {serverError && <p className="text-sm text-red">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Add rule'}
        </button>
      </form>
    </div>
  );
}
