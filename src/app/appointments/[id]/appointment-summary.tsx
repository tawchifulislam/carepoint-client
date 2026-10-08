import Link from 'next/link';
import { Check } from 'lucide-react';
import { StatusBadge } from '@/components/status-badge';
import { formatSlotDate, formatSlotTime } from '@/lib/format';
import type { AppointmentDetail } from '@/types/appointment';

export function AppointmentSummary({
  appointment,
  celebrate,
}: {
  appointment: AppointmentDetail;
  celebrate: boolean;
}) {
  const confirmed = appointment.status === 'BOOKED';
  const { doctor } = appointment;

  const rows = [
    { label: 'Doctor', value: doctor.user.name, mono: false },
    { label: 'Specialty', value: doctor.specialty, mono: false },
    { label: 'Clinic', value: doctor.clinic.name, mono: false },
    { label: 'Address', value: doctor.clinic.address, mono: false },
    {
      label: 'Date',
      value: formatSlotDate(appointment.slotStart),
      mono: false,
    },
    { label: 'Time', value: formatSlotTime(appointment.slotStart), mono: true },
    { label: 'Reference', value: appointment.id, mono: true },
  ];

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="text-center">
        {confirmed ? (
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white ${
              celebrate ? 'animate-pop' : ''
            }`}
          >
            <Check className="h-7 w-7" strokeWidth={2.5} />
          </div>
        ) : (
          <StatusBadge status={appointment.status} />
        )}

        <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">
          {confirmed ? 'Appointment confirmed' : 'Appointment details'}
        </h1>
      </div>

      <dl className="mt-8 rounded-xl border border-border bg-surface px-6 py-2 shadow-card">
        {rows.map(row => (
          <div
            key={row.label}
            className="flex justify-between gap-6 border-b border-border py-3.5 last:border-b-0"
          >
            <dt className="shrink-0 text-sm text-ink-muted">{row.label}</dt>
            <dd
              className={`min-w-0 text-right text-sm font-medium text-ink ${
                row.mono ? 'break-all font-mono' : 'wrap-break-word'
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard"
          className="rounded-sm bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-primary-hover active:scale-[0.97]"
        >
          Go to your appointments
        </Link>
        <Link
          href="/doctors"
          className="rounded-sm border border-border bg-surface px-5 py-3 text-center text-sm font-semibold text-ink transition-colors hover:border-primary"
        >
          Find another doctor
        </Link>
      </div>
    </div>
  );
}
