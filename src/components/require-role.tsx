'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProtectedRoute } from './protected-route';
import { useMe } from '@/lib/use-me';

export function RequireRole({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { me, loading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!loading && me && me.role !== role) {
      router.replace('/');
    }
  }, [loading, me, role, router]);

  return (
    <ProtectedRoute>
      {loading || !me || me.role !== role ? (
        <p className="py-16 text-center text-ink-muted">Loading...</p>
      ) : (
        children
      )}
    </ProtectedRoute>
  );
}
