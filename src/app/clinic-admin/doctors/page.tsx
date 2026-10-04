'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { StatusBadge } from '@/components/status-badge';

interface RosterDoctor {
  id: string;
  specialty: string;
  approvalStatus: string;
  consultationFee: number;
  user: { name: string; email: string };
}

interface PendingDoctor {
  id: string;
  specialty: string;
  consultationFee: number;
  user: { name: string; email: string };
}

export default function ClinicDoctorsPage() {
  const [roster, setRoster] = useState<RosterDoctor[]>([]);
  const [pending, setPending] = useState<PendingDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  async function load() {
    const [rosterResponse, pendingResponse] = await Promise.all([
      apiFetch('/api/clinics/me/doctors'),
      apiFetch('/api/admin/doctors/pending'),
    ]);
    setRoster(await rosterResponse.json());
    setPending(await pendingResponse.json());
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

  return (
    <div className="space-y-10">
      {pending.length > 0 && (
        <div>
          <h2 className="font-display text-lg font-medium text-ink">
            Pending approvals
          </h2>
          <div className="mt-3 space-y-2">
            {pending.map(doctor => (
              <div
                key={doctor.id}
                className="flex items-center justify-between rounded-md border border-amber bg-amber-tint p-4"
              >
                <div>
                  <p className="font-medium text-ink">{doctor.user.name}</p>
                  <p className="text-sm text-ink-muted">
                    {doctor.specialty} &middot; ${doctor.consultationFee}
                  </p>
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
        </div>
      )}

      <div>
        <h2 className="font-display text-lg font-medium text-ink">
          All doctors
        </h2>
        {roster.length === 0 ? (
          <p className="mt-3 text-sm text-ink-muted">No doctors yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {roster.map(doctor => (
              <div
                key={doctor.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface p-4 shadow-card"
              >
                <div>
                  <p className="font-medium text-ink">{doctor.user.name}</p>
                  <p className="text-sm text-ink-muted">
                    {doctor.specialty} &middot; ${doctor.consultationFee}
                  </p>
                </div>
                <StatusBadge status={doctor.approvalStatus} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
