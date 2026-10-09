'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { authClient, SESSION_TOKEN_KEY } from '@/lib/auth-client';
import { AuthContext, type MeResponse } from '@/lib/use-me';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async (): Promise<MeResponse | null> => {
    if (!localStorage.getItem(SESSION_TOKEN_KEY)) {
      setMe(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await apiFetch('/api/me');

      if (response.status === 401) {
        localStorage.removeItem(SESSION_TOKEN_KEY);
        setMe(null);
        return null;
      }

      if (!response.ok) {
        return null;
      }

      const data: MeResponse = await response.json();
      setMe(data);
      return data;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key === SESSION_TOKEN_KEY) {
        refresh();
      }
    }

    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  const signOutUser = useCallback(async () => {
    try {
      await authClient.signOut();
    } finally {
      localStorage.removeItem(SESSION_TOKEN_KEY);
      window.location.assign('/');
    }
  }, []);

  const value = useMemo(() => ({ me, loading, refresh, signOutUser }), [me, loading, refresh, signOutUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}