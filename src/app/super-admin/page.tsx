'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { MetricCard } from '@/components/metric-card';

interface Metrics {
  approvedClinics: number;
  approvedDoctors: number;
  patients: number;
  totalBookings: number;
  totalRevenue: number;
}

export default function SuperAdminOverviewPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    async function load() {
      const response = await apiFetch('/api/admin/metrics');
      setMetrics(await response.json());
    }
    load();
  }, []);

  if (!metrics) return <p className="text-ink-muted">Loading...</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard label="Approved clinics" value={metrics.approvedClinics} />
      <MetricCard label="Approved doctors" value={metrics.approvedDoctors} />
      <MetricCard label="Patients" value={metrics.patients} />
      <MetricCard label="Total bookings" value={metrics.totalBookings} />
      <MetricCard label="Total revenue" value={`$${metrics.totalRevenue}`} />
    </div>
  );
}
