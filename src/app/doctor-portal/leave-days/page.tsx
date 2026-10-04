'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiFetch } from '@/lib/api';
import {
  createExceptionSchema,
  type CreateExceptionInput,
} from '@/lib/validators/availability.schema';
import { formatDayLabel } from '@/lib/format';

interface LeaveDay {
  id: string;
  date: string;
}

export default function LeaveDaysPage() {
  const [days, setDays] = useState<LeaveDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExceptionInput>({
    resolver: zodResolver(createExceptionSchema),
  });

  async function load() {
    const response = await apiFetch('/api/doctors/me/exceptions');
    setDays(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(values: CreateExceptionInput) {
    setServerError(null);

    const response = await apiFetch('/api/doctors/me/exceptions', {
      method: 'POST',
      body: JSON.stringify(values),
    });
    const data = await response.json();

    if (!response.ok) {
      setServerError(
        typeof data.error === 'string'
          ? data.error
          : 'Could not block this day.',
      );
      return;
    }

    reset();
    await load();
  }

  async function deleteDay(id: string) {
    await apiFetch(`/api/doctors/me/exceptions/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_280px]">
      <div>
        {loading ? (
          <p className="text-ink-muted">Loading...</p>
        ) : days.length === 0 ? (
          <p className="text-ink-muted">No upcoming leave days.</p>
        ) : (
          <div className="space-y-2">
            {days.map(day => (
              <div
                key={day.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface p-4 shadow-card"
              >
                <p className="font-mono text-sm text-ink">
                  {formatDayLabel(day.date)}
                </p>
                <button
                  onClick={() => deleteDay(day.id)}
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
          Block a day
        </h2>

        <div>
          <input
            type="date"
            {...register('date')}
            className="w-full rounded-sm border border-border bg-surface px-3 py-2 text-sm text-ink"
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red">Select a valid date</p>
          )}
        </div>

        {serverError && <p className="text-sm text-red">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Block day'}
        </button>
      </form>
    </div>
  );
}
