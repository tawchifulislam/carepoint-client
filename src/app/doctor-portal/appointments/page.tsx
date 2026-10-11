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
        className="inline-flex rounded-md border border-border bg-surface p-1"
        role="group"
        aria-label="Appointment view"
      >
        {VIEWS.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            aria-pressed={view === item.id}
            className={`rounded-sm px-5 py-2 text-sm font-semibold transition-colors ${
              view === item.id
                ? 'bg-primary text-white'
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
