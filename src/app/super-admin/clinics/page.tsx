'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface PendingClinic {
  id: string;
  name: string;
  address: string;
  adminUser: { name: string; email: string };
}

export default function PendingClinicsPage() {
  const [clinics, setClinics] = useState<PendingClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  async function load() {
    const response = await apiFetch('/api/admin/clinics/pending');
    setClinics(await response.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function decide(id: string, status: 'APPROVED' | 'REJECTED') {
    setActioningId(id);
    try {
      await apiFetch(`/api/admin/clinics/${id}/approval`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await load();
    } finally {
      setActioningId(null);
    }
  }

  if (loading) return <p className="text-ink-muted">Loading...</p>;
  if (clinics.length === 0)
    return <p className="text-ink-muted">No pending clinics.</p>;

  return (
    <div className="space-y-2">
      {clinics.map(clinic => (
        <div
          key={clinic.id}
          className="flex items-center justify-between rounded-md border border-amber bg-amber-tint p-4"
        >
          <div>
            <p className="font-medium text-ink">{clinic.name}</p>
            <p className="text-sm text-ink-muted">{clinic.address}</p>
            <p className="text-sm text-ink-muted">
              {clinic.adminUser.name} &middot; {clinic.adminUser.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => decide(clinic.id, 'APPROVED')}
              disabled={actioningId === clinic.id}
              className="rounded-sm bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => decide(clinic.id, 'REJECTED')}
              disabled={actioningId === clinic.id}
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
