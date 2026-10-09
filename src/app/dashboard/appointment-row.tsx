import Link from 'next/link';
import { formatSlotDate, formatSlotTime } from '@/lib/format';
import { StatusBadge } from '@/components/status-badge';
import type { PatientAppointment } from '@/types/appointment';

export function AppointmentRow({
  appointment,
  actions,
}: {
  appointment: PatientAppointment;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-5">
        <div className="w-24 shrink-0">
          <p className="font-mono text-sm font-semibold text-ink">
            {formatSlotTime(appointment.slotStart)}
          </p>
          <p className="text-xs text-ink-muted">
            {formatSlotDate(appointment.slotStart)}
          </p>
        </div>
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
            className="rounded-sm border border-border px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-paper"
          >
            Check payment
          </Link>
        )}
        {actions}
      </div>
    </div>
  );
}
