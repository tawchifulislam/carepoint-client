import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { formatSlotDate, formatSlotTime, formatTimeUntil } from '@/lib/format';
import type { PatientAppointment } from '@/types/appointment';

interface NextAppointmentCardProps {
  appointment: PatientAppointment;
  nowMs: number;
  canModify: boolean;
  onCancel: () => void;
}

export function NextAppointmentCard({
  appointment,
  nowMs,
  canModify,
  onCancel,
}: NextAppointmentCardProps) {
  const { doctor } = appointment;

  return (
    <section
      aria-labelledby="next-appointment-heading"
      className="rounded-xl border border-border bg-surface p-6 shadow-card sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <h2
          id="next-appointment-heading"
          className="text-sm font-semibold text-ink-muted"
        >
          Next appointment
        </h2>
        <span className="rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary-hover">
          {formatTimeUntil(appointment.slotStart, nowMs)}
        </span>
      </div>

      <p className="mt-6 font-mono text-4xl font-semibold tracking-tight text-ink">
        {formatSlotTime(appointment.slotStart)}
      </p>
      <p className="mt-1 text-base text-ink-muted">
        {formatSlotDate(appointment.slotStart)}
      </p>

      <div className="mt-8">
        <p className="text-lg font-semibold text-ink">{doctor.user.name}</p>
        <p className="text-sm text-ink-muted">{doctor.specialty}</p>
        <p className="mt-3 flex items-start gap-2 text-sm text-ink-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            {doctor.clinic.name}, {doctor.clinic.address}
          </span>
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-6">
        <Link
          href={`/appointments/${appointment.id}`}
          className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover active:scale-[0.97]"
        >
          View details
        </Link>

        {canModify ? (
          <>
            <Link
              href={`/appointments/${appointment.id}/reschedule`}
              className="rounded-sm border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-paper"
            >
              Reschedule
            </Link>
            <button
              onClick={onCancel}
              className="rounded-sm px-3 py-2.5 text-sm font-semibold text-red transition-colors hover:bg-red-tint"
            >
              Cancel
            </button>
          </>
        ) : (
          <p className="text-sm text-ink-muted">
            Changes close 2 hours before the visit.
          </p>
        )}
      </div>
    </section>
  );
}
