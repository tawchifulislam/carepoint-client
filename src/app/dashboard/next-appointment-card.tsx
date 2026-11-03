import { Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Avatar } from '@/components/avatar';
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
      className="relative overflow-hidden rounded-xl bg-night p-6 text-white shadow-lift sm:p-8"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_90%_at_100%_0%,#000_20%,transparent_70%)]" />
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/40 blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <h2
            id="next-appointment-heading"
            className="font-mono text-xs font-semibold tracking-wide text-white/60"
          >
            NEXT APPOINTMENT
          </h2>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-[#7FF0D8]">
            <Clock className="h-3.5 w-3.5" />
            {formatTimeUntil(appointment.slotStart, nowMs)}
          </span>
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
          <div>
            <p className="font-mono text-5xl font-semibold tracking-tight">
              {formatSlotTime(appointment.slotStart)}
            </p>
            <p className="mt-1 text-base text-white/70">
              {formatSlotDate(appointment.slotStart)}
            </p>
          </div>

          <div className="flex items-start gap-4 md:justify-end md:text-right">
            <Avatar
              name={doctor.user.name}
              className="h-12 w-12 text-sm md:order-2"
            />
            <div className="min-w-0">
              <p className="text-lg font-semibold">{doctor.user.name}</p>
              <p className="text-sm text-white/70">{doctor.specialty}</p>
              <p className="mt-2 flex items-start gap-2 text-sm text-white/70 md:justify-end">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {doctor.clinic.name}, {doctor.clinic.address}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
          <Link
            href={`/appointments/${appointment.id}`}
            className="rounded-sm bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-primary-tint active:scale-[0.97]"
          >
            View details
          </Link>

          {canModify ? (
            <>
              <Link
                href={`/appointments/${appointment.id}/reschedule`}
                className="rounded-sm border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Reschedule
              </Link>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-sm px-3 py-2.5 text-sm font-semibold text-[#ffb4a2] transition-colors hover:bg-white/10"
              >
                Cancel
              </button>
            </>
          ) : (
            <p className="text-sm text-white/60">
              Changes close 2 hours before the visit.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
