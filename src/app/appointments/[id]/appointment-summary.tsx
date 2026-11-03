import { Check, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import { StatusBadge } from '@/components/status-badge';
import { PRIMARY_BUTTON, SECONDARY_LINK } from '@/lib/button-styles';
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
            className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-8px_rgb(10_112_136/0.7)] ring-8 ring-primary-tint ${
              celebrate ? 'animate-pop' : ''
            }`}
          >
            <Check className="h-8 w-8" strokeWidth={2.5} />
          </div>
        ) : (
          <StatusBadge status={appointment.status} />
        )}

        <h1 className="mt-6 text-2xl font-bold tracking-tight text-ink md:text-3xl">
          {confirmed ? 'Appointment confirmed' : 'Appointment details'}
        </h1>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-surface shadow-lift">
        <div className="relative overflow-hidden bg-night px-6 py-5 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_80%_100%_at_100%_0%,#000_20%,transparent_70%)]"
          />
          <div className="relative flex items-center gap-4">
            <Avatar name={doctor.user.name} className="h-12 w-12 text-sm" />
            <div className="min-w-0">
              <p className="truncate font-semibold">{doctor.user.name}</p>
              <p className="flex items-center gap-1.5 text-sm text-white/70">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{doctor.clinic.name}</span>
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-mono text-lg font-semibold">
                {formatSlotTime(appointment.slotStart)}
              </p>
              <p className="text-xs text-white/70">
                {formatSlotDate(appointment.slotStart)}
              </p>
            </div>
          </div>
        </div>

        <dl className="px-6 py-2">
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
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/dashboard" className={PRIMARY_BUTTON}>
          Go to your appointments
        </Link>
        <Link href="/doctors" className={SECONDARY_LINK}>
          Find another doctor
        </Link>
      </div>
    </div>
  );
}
