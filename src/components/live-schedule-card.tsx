'use client';

import { Check, Lock } from 'lucide-react';
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
    <div className="relative rounded-xl border border-border bg-surface p-6 opacity-0 shadow-lift animate-rise [animation-delay:150ms]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-[#12a3b4] to-[#0a6478] text-sm font-semibold text-white"
          >
            AH
          </span>
          <div className="text-sm font-semibold text-ink">
            Dr. Amelia Hart
            <span className="mt-0.5 block text-xs font-normal text-ink-muted">
              Cardiology &middot; Riverside Clinic
            </span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-mint-tint px-2.5 py-1 text-[11px] font-semibold text-primary-hover">
          <span className="h-1.75 w-1.75 rounded-full bg-mint animate-pulse-soft" />
          LIVE PREVIEW
        </div>
      </div>

      <div className="space-y-2">
        {slots.map(slot => (
          <div
            key={slot.time}
            className={`flex items-center justify-between rounded-md border px-4 py-3 text-[13px] transition-colors duration-500 ${
              slot.open
                ? 'border-primary/20 bg-primary-tint/70'
                : 'border-transparent bg-paper text-ink-muted'
            }`}
          >
            <span className="font-mono font-medium">{slot.time}</span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors duration-500 ${
                slot.open ? 'bg-primary text-white' : 'bg-border text-ink-muted'
              }`}
            >
              {slot.open ? (
                <Check className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {slot.open ? 'OPEN' : 'BOOKED'}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 border-t border-border pt-4 text-xs text-ink-muted">
        Open times come straight from the doctor&apos;s calendar.
      </p>
    </div>
  );
}
