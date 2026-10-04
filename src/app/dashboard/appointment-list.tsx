'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { formatDayLabel, formatSlotTime } from '@/lib/format';
import { StatusBadge } from '@/components/status-badge';

interface Appointment {
  id: string;
  status: string;
  slotStart: string;
  doctor: {
    specialty: string;
    user: { name: string };
    clinic: { name: string };
  };
}

interface AppointmentPage {
  data: Appointment[];
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 10;
const CANCELLATION_CUTOFF_MS = 2 * 60 * 60 * 1000;

export function AppointmentList() {
  const [result, setResult] = useState<AppointmentPage | null>(null);
  const [page, setPage] = useState(1);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (targetPage: number) => {
    const response = await apiFetch(
      `/api/appointments/me?page=${targetPage}&pageSize=${PAGE_SIZE}`,
    );
    const data: AppointmentPage = await response.json();
    setResult(data);
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  async function cancelAppointment(id: string) {
    setError(null);
    setActioningId(id);

    try {
      const response = await apiFetch(`/api/appointments/${id}/cancel`, {
        method: 'PATCH',
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Could not cancel this appointment.');
        return;
      }

      await load(page);
    } finally {
      setActioningId(null);
    }
  }

  if (!result) {
    return (
      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-md bg-border" />
        ))}
      </div>
    );
  }

  if (result.data.length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-ink-muted">You have no appointments yet.</p>
        <Link
          href="/doctors"
          className="mt-2 inline-block text-sm text-primary hover:underline"
        >
          Find a doctor
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="space-y-3">
        {result.data.map(appointment => {
          const canCancel =
            appointment.status === 'BOOKED' &&
            new Date(appointment.slotStart).getTime() - Date.now() >
              CANCELLATION_CUTOFF_MS;

          return (
            <div
              key={appointment.id}
              className="flex flex-col gap-3 rounded-md border border-border bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-base font-medium text-ink">
                    {appointment.doctor.user.name}
                  </h3>
                  <StatusBadge status={appointment.status} />
                </div>
                <p className="text-sm text-ink-muted">
                  {appointment.doctor.specialty} &middot;{' '}
                  {appointment.doctor.clinic.name}
                </p>
                <p className="mt-1 font-mono text-sm text-ink">
                  {formatDayLabel(appointment.slotStart.slice(0, 10))},{' '}
                  {formatSlotTime(appointment.slotStart)}
                </p>
              </div>

              {canCancel && (
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/appointments/${appointment.id}/reschedule`}
                    className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-paper"
                  >
                    Reschedule
                  </Link>
                  <button
                    onClick={() => cancelAppointment(appointment.id)}
                    disabled={actioningId === appointment.id}
                    className="rounded-sm border border-border px-4 py-2 text-sm font-medium text-ink hover:bg-paper disabled:opacity-50"
                  >
                    {actioningId === appointment.id
                      ? 'Cancelling...'
                      : 'Cancel'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="mt-3 text-sm text-red">{error}</p>}

      {result.totalPages > 1 && (
        <div className="mt-6 flex gap-2">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-sm px-3 py-2 text-sm font-mono ${
                p === result.page
                  ? 'bg-primary text-white'
                  : 'border border-border text-ink hover:bg-paper'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
