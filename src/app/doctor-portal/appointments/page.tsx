'use client';

import { useState } from 'react';
import { HistoryView } from './history-view';
import { ScheduleView } from './schedule-view';

const VIEWS = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'history', label: 'History' },
] as const;

export default function DoctorAppointmentsPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]['id']>('schedule');

  return (
    <div>
      <div
        className="inline-flex rounded-lg border border-border bg-surface p-1 shadow-card"
        role="group"
        aria-label="Appointment view"
      >
        {VIEWS.map(item => (
          <button
            type="button"
            key={item.id}
            onClick={() => setView(item.id)}
            aria-pressed={view === item.id}
            className={`rounded-md px-5 py-2 text-sm font-semibold transition-colors ${
              view === item.id
                ? 'bg-primary text-white shadow-[0_6px_14px_-6px_rgb(10_112_136/0.6)]'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {view === 'schedule' ? <ScheduleView /> : <HistoryView />}
      </div>
    </div>
  );
}
