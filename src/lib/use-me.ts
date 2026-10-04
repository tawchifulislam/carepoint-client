'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from './api';

export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
  doctor: { id: string; approvalStatus: string } | null;
  adminOfClinic: { id: string; approvalStatus: string } | null;
}

export function useMe() {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await apiFetch('/api/me');
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) setMe(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { me, loading };
}
