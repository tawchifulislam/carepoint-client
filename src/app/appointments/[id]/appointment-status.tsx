'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Clock, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { formatSlotTime } from '@/lib/format';
import { ProgressSteps } from '@/components/progress-steps';
import type { AppointmentDetail } from '@/types/appointment';
import { AppointmentSummary } from './appointment-summary';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30;
const CONFIRMING_STEPS = [
  'Payment submitted',
  'Confirming with the clinic',
  'Appointment confirmed',
];

const TONES = {
  amber: 'bg-amber-tint text-amber',
  red: 'bg-red-tint text-red',
};

const PRIMARY_BUTTON =
  'rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-hover active:scale-[0.97] disabled:opacity-50';
const SECONDARY_LINK =
  'rounded-sm border border-border bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary';

function StateCard({
  icon: Icon,
  tone,
  title,
  children,
}: {
  icon: LucideIcon;
  tone: keyof typeof TONES;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-md text-center">
      <div
        className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${TONES[tone]}`}
      >
        <Icon className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">
        {title}
      </h1>
      <div className="mt-3 space-y-5 text-sm text-ink-muted">{children}</div>
    </div>
  );
}

export function AppointmentStatus({
  appointmentId,
  justPaid,
}: {
  appointmentId: string;
  justPaid: boolean;
}) {
  const [appointment, setAppointment] = useState<AppointmentDetail | null>(
    null,
  );
  const [loadError, setLoadError] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [pollKey, setPollKey] = useState(0);
  const [resuming, setResuming] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    async function poll(attempt: number) {
      try {
        const response = await apiFetch(`/api/appointments/${appointmentId}`);

        if (cancelled) return;

        if (!response.ok) {
          setLoadError(true);
          return;
        }

        const data: AppointmentDetail = await response.json();

        if (cancelled) return;

        setLoadError(false);
        setAppointment(data);

        if (!justPaid || data.status !== 'PENDING_PAYMENT') {
          setTimedOut(false);
          return;
        }

        if (attempt >= MAX_POLL_ATTEMPTS) {
          setTimedOut(true);
          return;
        }

        timeoutId = setTimeout(() => poll(attempt + 1), POLL_INTERVAL_MS);
      } catch {
        if (!cancelled) setLoadError(true);
      }
    }

    setTimedOut(false);
    poll(0);

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [appointmentId, justPaid, pollKey]);

  function retry() {
    setLoadError(false);
    setPollKey(key => key + 1);
  }

  async function resumePayment() {
    setResuming(true);
    setResumeError(null);

    try {
      const response = await apiFetch(
        `/api/appointments/${appointmentId}/resume-payment`,
        {
          method: 'POST',
        },
      );
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setResumeError(
          typeof data.error === 'string'
            ? data.error
            : 'Could not resume payment.',
        );
        setResuming(false);
        setPollKey(key => key + 1);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setResumeError('Something went wrong. Please try again.');
      setResuming(false);
    }
  }

  if (loadError && !appointment) {
    return (
      <StateCard
        icon={AlertCircle}
        tone="red"
        title="Could not load this appointment"
      >
        <p>Check your connection and try again.</p>
        <button onClick={retry} className={PRIMARY_BUTTON}>
          Try again
        </button>
      </StateCard>
    );
  }

  if (!appointment) {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-border" />
        <div className="mx-auto mt-5 h-7 w-56 animate-pulse rounded-md bg-border" />
        <div className="mt-8 h-64 animate-pulse rounded-xl bg-border" />
      </div>
    );
  }

  if (appointment.status === 'PENDING_PAYMENT' && justPaid) {
    const stalled = timedOut || loadError;

    return (
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-center text-2xl font-bold tracking-tight text-ink">
          {stalled ? 'Still confirming' : 'Confirming your booking'}
        </h1>
        <p className="mt-2 text-center text-sm text-ink-muted">
          {stalled
            ? 'This is taking longer than usual.'
            : 'This usually takes a few seconds. Please keep this page open.'}
        </p>

        <div className="mt-8 rounded-xl border border-border bg-surface p-6 shadow-card">
          <ProgressSteps
            steps={CONFIRMING_STEPS}
            current={1}
            stalled={stalled}
          />
        </div>

        {stalled && (
          <div className="mt-6 space-y-4 text-center">
            <p className="text-sm text-ink-muted">
              If your payment went through, the booking will appear in your
              appointments shortly. You will not be charged twice.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button onClick={retry} className={PRIMARY_BUTTON}>
                Check again
              </button>
              <Link href="/dashboard" className={SECONDARY_LINK}>
                Go to your appointments
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (appointment.status === 'PENDING_PAYMENT') {
    const holdActive =
      appointment.holdExpiresAt !== null &&
      new Date(appointment.holdExpiresAt).getTime() > Date.now();

    return (
      <StateCard icon={Clock} tone="amber" title="Payment not completed">
        <p>
          {holdActive && appointment.holdExpiresAt
            ? `Your slot is held until ${formatSlotTime(appointment.holdExpiresAt)}.`
            : 'The hold on this slot has ended. Choose a time again to rebook.'}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          {holdActive && (
            <button
              onClick={resumePayment}
              disabled={resuming}
              className={PRIMARY_BUTTON}
            >
              {resuming ? 'Opening checkout...' : 'Resume payment'}
            </button>
          )}
          <Link
            href={`/doctors/${appointment.doctorId}`}
            className={SECONDARY_LINK}
          >
            Choose another time
          </Link>
        </div>

        {resumeError && (
          <p role="alert" className="text-red">
            {resumeError}
          </p>
        )}
      </StateCard>
    );
  }

  if (appointment.status === 'CANCELLED') {
    return (
      <StateCard
        icon={XCircle}
        tone="red"
        title="This booking was not completed"
      >
        <p>
          The payment was not completed in time, or the appointment was
          cancelled.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/doctors/${appointment.doctorId}`}
            className={PRIMARY_BUTTON}
          >
            Choose another time
          </Link>
          <Link href="/dashboard" className={SECONDARY_LINK}>
            Go to your appointments
          </Link>
        </div>
      </StateCard>
    );
  }

  return <AppointmentSummary appointment={appointment} celebrate={justPaid} />;
}
