'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatSlotTime, formatDayLabel } from '@/lib/format';

interface AppointmentDetail {
  id: string;
  status: 'PENDING_PAYMENT' | 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  slotStart: string;
  doctor: {
    specialty: string;
    user: { name: string };
    clinic: { name: string; address: string };
  };
}

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 15;

export function AppointmentStatus({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null,
  );
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    async function poll(attempt: number) {
      try {
        const response = await apiFetch(`/api/appointments/${appointmentId}`);

        if (!response.ok) {
          if (!cancelled) setError(true);
          return;
        }

        const data: AppointmentDetail = await response.json();
        if (cancelled) return;

        setAppointment(data);

        if (data.status === 'PENDING_PAYMENT') {
          if (attempt >= MAX_ATTEMPTS) {
            setTimedOut(true);
            return;
          }
          timeoutId = setTimeout(() => poll(attempt + 1), POLL_INTERVAL_MS);
        }
      } catch {
        if (!cancelled) setError(true);
      }
    }

    poll(0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [appointmentId]);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <XCircle className="h-10 w-10 text-red" />
        <p className="text-ink">Could not load this appointment.</p>
        <Link href="/doctors" className="text-sm text-primary hover:underline">
          Back to search
        </Link>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-ink-muted">Loading...</p>
      </div>
    );
  }

  if (appointment.status === 'PENDING_PAYMENT') {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <Loader2
          className={`h-8 w-8 animate-spin ${timedOut ? 'text-amber' : 'text-primary'}`}
        />
        <p className="text-ink">
          {timedOut
            ? 'Still confirming your payment.'
            : 'Confirming your payment...'}
        </p>
        {timedOut && (
          <p className="text-sm text-ink-muted">
            This is taking longer than usual. Check back in a minute.
          </p>
        )}
      </div>
    );
  }

  if (appointment.status === 'CANCELLED') {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <XCircle className="h-10 w-10 text-red" />
        <p className="text-ink">This booking was not completed.</p>
        <Link href="/doctors" className="text-sm text-primary hover:underline">
          Find another slot
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <CheckCircle2 className="h-10 w-10 text-primary" />
      <h1 className="font-display text-2xl font-semibold text-ink">
        Appointment confirmed
      </h1>

      <div className="mt-4 w-full max-w-sm rounded-md border border-border bg-surface p-5 text-left shadow-card">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Doctor</dt>
            <dd className="text-ink">{appointment.doctor.user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Specialty</dt>
            <dd className="text-ink">{appointment.doctor.specialty}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Clinic</dt>
            <dd className="text-ink">{appointment.doctor.clinic.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">When</dt>
            <dd className="font-mono text-ink">
              {formatDayLabel(appointment.slotStart.slice(0, 10))},{' '}
              {formatSlotTime(appointment.slotStart)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Reference</dt>
            <dd className="font-mono text-ink">{appointment.id}</dd>
          </div>
        </dl>
      </div>

      <Link
        href="/dashboard"
        className="mt-4 text-sm text-primary hover:underline"
      >
        Go to your appointments
      </Link>
    </div>
  );
}
