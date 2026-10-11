'use client';

import { useState } from 'react';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { usePagedList } from '@/lib/use-paged-list';
import type { DoctorAppointment } from '@/types/doctor-portal';
import { DoctorAppointmentRow } from './doctor-appointment-row';

const FILTERS = [
  { id: '', label: 'All' },
  { id: 'COMPLETED', label: 'Completed' },
  { id: 'NO_SHOW', label: 'No show' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

const CHIP_BASE =
  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors';
const CHIP_ACTIVE = 'border-primary bg-primary text-white';
const CHIP_IDLE =
  'border-border bg-surface text-ink hover:border-primary hover:text-primary-hover';

export function HistoryView() {
  const [filter, setFilter] = useState('');

  const path = `/api/doctors/me/appointments?scope=history&pageSize=20${filter ? `&status=${filter}` : ''}`;
  const { items, error, loadingMore, hasMore, reload, loadMore } =
    usePagedList<DoctorAppointment>(path);

  const activeLabel = FILTERS.find(item => item.id === filter)?.label ?? 'All';

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        {FILTERS.map(item => (
          <button
            key={item.id || 'all'}
            onClick={() => setFilter(item.id)}
            aria-pressed={filter === item.id}
            className={`${CHIP_BASE} ${filter === item.id ? CHIP_ACTIVE : CHIP_IDLE}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {error && items === null && (
          <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
            <p className="font-semibold text-ink">
              Could not load your history
            </p>
            <button onClick={reload} className={`${PRIMARY_BUTTON} mt-5`}>
              Try again
            </button>
          </div>
        )}

        {!error && items === null && (
          <div className="space-y-2">
            <div className="h-16 animate-pulse rounded-lg bg-border" />
            <div className="h-16 animate-pulse rounded-lg bg-border" />
            <div className="h-16 animate-pulse rounded-lg bg-border" />
          </div>
        )}

        {items !== null && items.length === 0 && (
          <div className="rounded-xl border border-dashed border-border px-6 py-14 text-center">
            <p className="text-ink">
              {filter
                ? `No ${activeLabel.toLowerCase()} appointments.`
                : 'No past appointments yet.'}
            </p>
          </div>
        )}

        {items !== null && items.length > 0 && (
          <div className="space-y-2">
            {items.map(appointment => (
              <DoctorAppointmentRow
                key={appointment.id}
                appointment={appointment}
                showDate
                showStatus
              />
            ))}
          </div>
        )}

        {error && items !== null && (
          <p role="alert" className="mt-4 text-sm text-red">
            Something went wrong while loading.{' '}
            <button onClick={reload} className="font-semibold underline">
              Try again
            </button>
          </p>
        )}

        {hasMore && (
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="mt-4 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Show more'}
          </button>
        )}
      </div>
    </div>
  );
}
