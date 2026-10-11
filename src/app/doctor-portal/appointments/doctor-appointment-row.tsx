import { StatusBadge } from '@/components/status-badge';
import { formatSlotDate, formatSlotTime } from '@/lib/format';
import type { DoctorAppointment } from '@/types/doctor-portal';

export function DoctorAppointmentRow({
  appointment,
  showDate = false,
  showStatus = false,
  actions,
}: {
  appointment: DoctorAppointment;
  showDate?: boolean;
  showStatus?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-5">
        <div className="w-28 shrink-0">
          <p className="font-mono text-sm font-semibold text-ink">
            {formatSlotTime(appointment.slotStart)}
          </p>
          <p className="text-xs text-ink-muted">
            {showDate
              ? formatSlotDate(appointment.slotStart)
              : `to ${formatSlotTime(appointment.slotEnd)}`}
          </p>
        </div>
        <p className="truncate text-sm font-semibold text-ink">
          {appointment.patient.name}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {showStatus && <StatusBadge status={appointment.status} />}
        {actions}
      </div>
    </div>
  );
}
