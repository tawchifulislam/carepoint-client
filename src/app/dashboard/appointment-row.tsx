import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import { StatusBadge } from '@/components/status-badge';
import { formatSlotDate, formatSlotTime } from '@/lib/format';
import type { PatientAppointment } from '@/types/appointment';

export function AppointmentRow({
  appointment,
  actions,
}: {
  appointment: PatientAppointment;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 shadow-card transition-colors hover:border-primary/30 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <div className="flex min-w-0 items-center gap-4">
        <div className="w-24 shrink-0 rounded-md bg-paper px-3 py-2 text-center">
          <p className="font-mono text-sm font-semibold text-ink">
            {formatSlotTime(appointment.slotStart)}
          </p>
          <p className="text-xs text-ink-muted">
            {formatSlotDate(appointment.slotStart)}
          </p>
        </div>
        <Avatar
          name={appointment.doctor.user.name}
          className="hidden h-10 w-10 text-xs sm:flex"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">
            {appointment.doctor.user.name}
          </p>
          <p className="truncate text-sm text-ink-muted">
            {appointment.doctor.specialty} &middot;{' '}
            {appointment.doctor.clinic.name}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={appointment.status} />
        {appointment.status === 'PENDING_PAYMENT' && (
          <Link
            href={`/appointments/${appointment.id}`}
            className="rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-primary/50 hover:bg-paper"
          >
            Check payment
          </Link>
        )}
        {actions}
      </div>
    </div>
  );
}
