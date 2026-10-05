'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { apiFetch } from '@/lib/api';
import { formatDayLabel, formatSlotTime } from '@/lib/format';
import type { DaySlots } from '@/types/availability';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function dateKeyFromOffset(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

export function SlotPicker({ doctorId }: { doctorId: string }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [days, setDays] = useState<DaySlots[]>([]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const from = dateKeyFromOffset(1);
      const to = dateKeyFromOffset(7);
      const response = await fetch(
        `${API_URL}/api/doctors/${doctorId}/availability?from=${from}&to=${to}`,
      );
      const data: DaySlots[] = await response.json();
      setDays(data);
      setLoading(false);
    }

    load();
  }, [doctorId]);

  async function bookSlot(slotStart: string) {
    setError(null);

    if (isPending) return;

    if (!session) {
      router.push('/sign-in');
      return;
    }

    setBooking(slotStart);

    try {
      const response = await apiFetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ doctorId, slotStart }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? 'This slot is no longer available.');
        setBooking(null);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError('Something went wrong. Please try again.');
      setBooking(null);
    }
  }

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-sm bg-border" />
        ))}
      </div>
    );
  }

  const activeDay = days[selectedDay];

  return (
    <div className="mt-6">
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
            onClick={() => bookSlot(slot.start)}
            disabled={booking !== null}
            className="rounded-sm bg-primary-tint px-4 py-2 font-mono text-sm text-primary hover:bg-primary hover:text-white disabled:opacity-50"
          >
            {booking === slot.start ? '...' : formatSlotTime(slot.start)}
          </button>
        ))}
      </div>

      {error && <p className="mt-3 text-sm text-red">{error}</p>}
    </div>
  );
}
