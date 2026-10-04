'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { formatDayLabel, formatSlotTime } from '@/lib/format';
import { StatusBadge } from '@/components/status-badge';

interface DoctorAppointment {
  id: string;
  slotStart: string;
  slotEnd: string;
  status: string;
  patient: { name: string };
}

interface AppointmentPage {
  data: DoctorAppointment[];
  page: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

export default function DoctorAppointmentsPage() {
  const [result, setResult] = useState<AppointmentPage | null>(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const query = new URLSearchParams({
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    if (statusFilter) query.set('status', statusFilter);
    const response = await apiFetch(
      `/api/doctors/me/appointments?${query.toString()}`,
    );
    setResult(await response.json());
  }

  useEffect(() => {
    load();
  }, [page, statusFilter]);

  async function updateStatus(id: string, status: 'COMPLETED' | 'NO_SHOW') {
    setError(null);
    setActioningId(id);

    try {
      const response = await apiFetch(
        `/api/doctors/me/appointments/${id}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'Could not update this appointment.');
        return;
      }

      await load();
    } finally {
      setActioningId(null);
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        {['', 'BOOKED', 'COMPLETED', 'NO_SHOW', 'CANCELLED'].map(status => (
          <button
            key={status || 'all'}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`rounded-sm px-3 py-2 text-sm ${
              statusFilter === status
                ? 'bg-primary-tint text-primary'
                : 'text-ink-muted hover:bg-paper'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {!result ? (
        <p className="mt-6 text-ink-muted">Loading...</p>
      ) : result.data.length === 0 ? (
        <p className="mt-6 text-ink-muted">No appointments here.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {result.data.map(appointment => {
            const isPast =
              new Date(appointment.slotStart).getTime() < Date.now();

            return (
              <div
                key={appointment.id}
                className="flex flex-col gap-3 rounded-md border border-border bg-surface p-5 shadow-card sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-base font-medium text-ink">
                      {appointment.patient.name}
                    </h3>
                    <StatusBadge status={appointment.status} />
                  </div>
                  <p className="mt-1 font-mono text-sm text-ink">
                    {formatDayLabel(appointment.slotStart.slice(0, 10))},{' '}
                    {formatSlotTime(appointment.slotStart)}
                  </p>
                </div>

                {appointment.status === 'BOOKED' && isPast && (
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => updateStatus(appointment.id, 'COMPLETED')}
                      disabled={actioningId === appointment.id}
                      className="rounded-sm bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
                    >
                      Completed
                    </button>
                    <button
                      onClick={() => updateStatus(appointment.id, 'NO_SHOW')}
                      disabled={actioningId === appointment.id}
                      className="rounded-sm border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-paper disabled:opacity-50"
                    >
                      No show
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="mt-3 text-sm text-red">{error}</p>}

      {result && result.totalPages > 1 && (
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
