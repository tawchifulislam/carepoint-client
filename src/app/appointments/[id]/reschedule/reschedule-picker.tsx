'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { formatDayLabel, formatSlotTime } from '@/lib/format';

interface DaySlots {
  date: string;
  slots: { start: string; end: string }[];
}

interface AppointmentDetail {
  id: string;
  doctorId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function dateKeyFromOffset(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

export function ReschedulePicker({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [days, setDays] = useState<DaySlots[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const appointmentResponse = await apiFetch(
        `/api/appointments/${appointmentId}`,
      );
      const appointment: AppointmentDetail = await appointmentResponse.json();

      const from = dateKeyFromOffset(1);
      const to = dateKeyFromOffset(7);
      const availabilityResponse = await fetch(
        `${API_URL}/api/doctors/${appointment.doctorId}/availability?from=${from}&to=${to}`,
      );
      const data: DaySlots[] = await availabilityResponse.json();

      setDoctorId(appointment.doctorId);
      setDays(data);
      setLoading(false);
    }

    load();
  }, [appointmentId]);

  async function reschedule(slotStart: string) {
    setError(null);
    setSaving(slotStart);

    const response = await apiFetch(
      `/api/appointments/${appointmentId}/reschedule`,
      {
        method: 'PATCH',
        body: JSON.stringify({ slotStart }),
      },
    );
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? 'This slot is no longer available.');
      setSaving(null);
      return;
    }

    router.push('/dashboard');
  }

  if (loading || !doctorId) {
    return <p className="text-ink-muted">Loading...</p>;
  }

  const activeDay = days[selectedDay];

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day, i) => (
          <button
            key={day.date}
            onClick={() => setSelectedDay(i)}
            className={`shrink-0 rounded-sm border px-4 py-2 text-sm font-mono ${
              i === selectedDay
                ? 'border-primary bg-primary-tint text-primary'
                : 'border-border text-ink hover:bg-paper'
            }`}
          >
            {formatDayLabel(day.date)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {activeDay?.slots.length === 0 && (
          <p className="text-sm text-ink-muted">No open slots this day.</p>
        )}
        {activeDay?.slots.map(slot => (
          <button
            key={slot.start}
            onClick={() => reschedule(slot.start)}
            disabled={saving !== null}
            className="rounded-sm bg-primary-tint px-4 py-2 font-mono text-sm text-primary hover:bg-primary hover:text-white disabled:opacity-50"
          >
            {saving === slot.start ? '...' : formatSlotTime(slot.start)}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-red">{error}</p>}
    </div>
  );
}
