'use client';

import { useEffect, useState } from 'react';

const INITIAL_SLOTS = [
  { time: '09:00', open: true },
  { time: '09:30', open: false },
  { time: '10:00', open: true },
  { time: '10:30', open: true },
];

export function LiveScheduleCard() {
  const [slots, setSlots] = useState(INITIAL_SLOTS);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = setInterval(() => {
      setSlots(current => {
        const index = Math.floor(Math.random() * current.length);
        const next = current.map((slot, i) =>
          i === index ? { ...slot, open: !slot.open } : slot,
        );
        return next.some(slot => slot.open) ? next : current;
      });
    }, 2600);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative mt-6 rounded-xl border border-border bg-surface p-6 opacity-0 shadow-[0_20px_50px_rgb(18_29_40/0.08)] animate-rise [animation-delay:150ms] md:-ml-10 md:mt-10">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-ink">
          Dr. Amelia Hart
          <span className="mt-0.5 block text-xs font-normal text-ink-muted">
            Cardiology &middot; Riverside Clinic
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary-hover">
          <span className="h-1.75 w-1.75 rounded-full bg-primary animate-pulse-soft" />
          LIVE PREVIEW
        </div>
      </div>

      {slots.map(slot => (
        <div
          key={slot.time}
          className={`mb-1.5 flex items-center justify-between rounded-md px-3 py-2.5 text-[13px] transition-colors duration-500 ${
            slot.open ? 'bg-primary-tint' : 'bg-paper text-ink-muted'
          }`}
        >
          <span className="font-mono font-medium">{slot.time}</span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors duration-500 ${
              slot.open ? 'bg-primary text-white' : 'bg-border text-ink-muted'
            }`}
          >
            {slot.open ? 'OPEN' : 'BOOKED'}
          </span>
        </div>
      ))}
    </div>
  );
}
