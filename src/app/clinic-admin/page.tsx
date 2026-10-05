'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { apiFetch } from '@/lib/api';
import { MetricCard } from '@/components/metric-card';
import type { ClinicSummary } from '@/types/clinic';


interface DashboardDoctor {
  doctorId: string;
  doctorName: string;
  bookingCount: number;
  revenue: number;
}

interface Dashboard {
  clinicId: string;
  clinicName: string;
  doctors: DashboardDoctor[];
}

export default function ClinicOverviewPage() {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const clinicResponse = await apiFetch('/api/clinics/me');

      if (!clinicResponse.ok) {
        setError('No clinic found for this account.');
        setLoading(false);
        return;
      }

      const clinic: ClinicSummary = await clinicResponse.json();
      const dashboardResponse = await apiFetch(
        `/api/clinics/${clinic.id}/dashboard`,
      );
      setDashboard(await dashboardResponse.json());
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p className="text-ink-muted">Loading...</p>;
  if (error) return <p className="text-sm text-red">{error}</p>;
  if (!dashboard) return null;

  const totalBookings = dashboard.doctors.reduce(
    (sum, d) => sum + d.bookingCount,
    0,
  );
  const totalRevenue = dashboard.doctors.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <div>
      <h2 className="font-display text-lg font-medium text-ink">
        {dashboard.clinicName}
      </h2>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <MetricCard label="Doctors" value={dashboard.doctors.length} />
        <MetricCard label="Total bookings" value={totalBookings} />
        <MetricCard label="Total revenue" value={`$${totalRevenue}`} />
      </div>

      <div className="mt-8 rounded-md border border-border bg-surface p-5 shadow-card">
        <h3 className="font-display text-sm font-semibold text-ink">
          Revenue by doctor
        </h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboard.doctors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DADFDB" />
              <XAxis dataKey="doctorName" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0E6E55" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
