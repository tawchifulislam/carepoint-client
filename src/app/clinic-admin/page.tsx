'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/metric-card';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { formatMoney } from '@/lib/money';
import type { ClinicDashboard, DashboardRange } from '@/types/admin';
import { RevenueChart } from './revenue-chart';

const RANGES: { id: DashboardRange; label: string }[] = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: 'all', label: 'All time' },
];

export default function ClinicOverviewPage() {
  const [range, setRange] = useState<DashboardRange>('30d');
  const [dashboard, setDashboard] = useState<ClinicDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setLoading(true);
    setLoadError(false);

    try {
      const response = await apiFetch(
        `/api/clinics/me/dashboard?range=${range}`,
      );

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data: ClinicDashboard = await response.json();

      if (id === requestId.current) setDashboard(data);
    } catch {
      if (id === requestId.current) setLoadError(true);
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    load();
  }, [load]);

  if (loadError && dashboard === null) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="font-semibold text-ink">Could not load your dashboard</p>
        <p className="mt-1 text-sm text-ink-muted">
          Check your connection and try again.
        </p>
        <button onClick={load} className={`${PRIMARY_BUTTON} mt-5`}>
          Try again
        </button>
      </div>
    );
  }

  if (dashboard === null) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 animate-pulse rounded-md bg-border" />
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-28 animate-pulse rounded-lg bg-border" />
          <div className="h-28 animate-pulse rounded-lg bg-border" />
          <div className="h-28 animate-pulse rounded-lg bg-border" />
        </div>
        <div className="h-72 animate-pulse rounded-xl bg-border" />
      </div>
    );
  }

  const maxRevenue = Math.max(
    ...dashboard.doctors.map(doctor => doctor.revenue),
    0,
  );
  const { pendingDoctors } = dashboard.totals;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">
            {dashboard.clinicName}
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">{dashboard.address}</p>
        </div>

        <div
          className="inline-flex self-start rounded-md border border-border bg-surface p-1"
          role="group"
          aria-label="Date range"
        >
          {RANGES.map(item => (
            <button
              key={item.id}
              onClick={() => setRange(item.id)}
              aria-pressed={range === item.id}
              className={`rounded-sm px-4 py-2 text-sm font-semibold transition-colors ${
                range === item.id
                  ? 'bg-primary text-white'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {pendingDoctors > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber bg-amber-tint px-5 py-4">
          <p className="text-sm text-ink">
            {pendingDoctors}{' '}
            {pendingDoctors === 1 ? 'doctor is' : 'doctors are'} waiting for
            your approval.
          </p>
          <Link
            href="/clinic-admin/doctors"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Review now
          </Link>
        </div>
      )}

      <div
        className={`space-y-8 transition-opacity ${loading ? 'opacity-60' : ''}`}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            label="Revenue"
            value={formatMoney(dashboard.totals.revenue)}
          />
          <MetricCard label="Bookings" value={dashboard.totals.bookings} />
          <MetricCard
            label="Active doctors"
            value={dashboard.totals.activeDoctors}
          />
        </div>

        <section
          className="rounded-xl border border-border bg-surface p-6"
          aria-labelledby="revenue-heading"
        >
          <h3 id="revenue-heading" className="text-sm font-semibold text-ink">
            Revenue by day
          </h3>
          <div className="mt-4">
            <RevenueChart series={dashboard.series} range={dashboard.range} />
          </div>
        </section>

        <section
          className="rounded-xl border border-border bg-surface p-6"
          aria-labelledby="doctors-heading"
        >
          <h3 id="doctors-heading" className="text-sm font-semibold text-ink">
            Doctors
          </h3>

          {dashboard.doctors.length === 0 ? (
            <p className="mt-4 text-sm text-ink-muted">
              No doctors yet. Doctors appear here after they apply to your
              clinic.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-border">
              {dashboard.doctors.map(doctor => {
                const share =
                  maxRevenue > 0
                    ? Math.round((doctor.revenue / maxRevenue) * 100)
                    : 0;

                return (
                  <li
                    key={doctor.doctorId}
                    className="grid grid-cols-[1fr_auto] items-center gap-4 py-3 sm:grid-cols-[1.5fr_1fr_120px]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {doctor.doctorName}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {doctor.bookingCount}{' '}
                        {doctor.bookingCount === 1 ? 'booking' : 'bookings'}
                      </p>
                    </div>
                    <div
                      className="hidden h-2 rounded-full bg-paper sm:block"
                      aria-hidden="true"
                    >
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${share}%` }}
                      />
                    </div>
                    <p className="text-right font-mono text-sm font-semibold text-ink">
                      {formatMoney(doctor.revenue)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
