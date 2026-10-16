'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/metric-card';
import { apiFetch } from '@/lib/api';
import { PRIMARY_BUTTON } from '@/lib/button-styles';
import { formatMoney } from '@/lib/money';
import type { PlatformMetrics } from '@/types/admin';

export default function SuperAdminOverviewPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [loadError, setLoadError] = useState(false);

  const load = useCallback(async () => {
    setLoadError(false);

    try {
      const response = await apiFetch('/api/admin/metrics');

      if (!response.ok) {
        throw new Error('Request failed');
      }

      setMetrics(await response.json());
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loadError && metrics === null) {
    return (
      <div className="rounded-xl border border-border bg-surface px-6 py-12 text-center">
        <p className="font-semibold text-ink">
          Could not load platform metrics
        </p>
        <p className="mt-1 text-sm text-ink-muted">
          Check your connection and try again.
        </p>
        <button onClick={load} className={`${PRIMARY_BUTTON} mt-5`}>
          Try again
        </button>
      </div>
    );
  }

  if (metrics === null) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-lg bg-border"
          />
        ))}
      </div>
    );
  }

  const waiting = metrics.pendingClinics + metrics.pendingDoctors;

  return (
    <div className="space-y-8">
      {waiting > 0 && (
        <section
          aria-label="Needs review"
          className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-amber bg-amber-tint px-5 py-4"
        >
          <p className="text-sm font-semibold text-ink">Needs review</p>
          <div className="flex flex-wrap gap-5 text-sm">
            {metrics.pendingClinics > 0 && (
              <Link
                href="/super-admin/clinics"
                className="font-semibold text-primary hover:underline"
              >
                {metrics.pendingClinics}{' '}
                {metrics.pendingClinics === 1 ? 'clinic' : 'clinics'}
              </Link>
            )}
            {metrics.pendingDoctors > 0 && (
              <Link
                href="/super-admin/doctors"
                className="font-semibold text-primary hover:underline"
              >
                {metrics.pendingDoctors}{' '}
                {metrics.pendingDoctors === 1 ? 'doctor' : 'doctors'}
              </Link>
            )}
          </div>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Approved clinics" value={metrics.approvedClinics} />
        <MetricCard label="Approved doctors" value={metrics.approvedDoctors} />
        <MetricCard label="Patients" value={metrics.patients} />
        <MetricCard
          label="Bookings"
          value={metrics.totalBookings}
          hint="Booked and completed"
        />
        <MetricCard
          label="Revenue"
          value={formatMoney(metrics.totalRevenue)}
          hint="Successful payments, all time"
        />
      </div>
    </div>
  );
}
