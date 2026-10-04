'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface PendingDoctor {
  id: string;
  specialty: string;
  consultationFee: number;
  user: { name: string; email: string };
  clinic: { id: string; name: string };
}

export default function PendingDoctorsPage() {
  const [doctors, setDoctors] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  async function load() {
    const response = await apiFetch('/api/admin/doctors/pending');
    setDoctors(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, status: 'APPROVED' | 'REJECTED') {
    setActioningId(id);
    try {
      await apiFetch(`/api/admin/doctors/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await load();
    } finally {
      setActioningId(null);
    }
  }

  if (loading) return <p className="text-ink-muted">Loading...</p>;
  if (doctors.length === 0)
    return <p className="text-ink-muted">No pending doctors.</p>;

  return (
    <div className="space-y-2">
      {doctors.map(doctor => (
        <div
          key={doctor.id}
          className="flex items-center justify-between rounded-md border border-amber bg-amber-tint p-4"
        >
          <div>
            <p className="font-medium text-ink">{doctor.user.name}</p>
            <p className="text-sm text-ink-muted">
              {doctor.specialty} &middot; ${doctor.consultationFee} &middot;{' '}
              {doctor.clinic.name}
            </p>
            <p className="text-sm text-ink-muted">{doctor.user.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => decide(doctor.id, 'APPROVED')}
              disabled={actioningId === doctor.id}
              className="rounded-sm bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => decide(doctor.id, 'REJECTED')}
              disabled={actioningId === doctor.id}
              className="rounded-sm border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-paper disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
