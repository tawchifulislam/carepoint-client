'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { type MeResponse, useMe } from '@/lib/use-me';
import { ProtectedRoute } from './protected-route';

const APPROVAL_FIELD: Partial<Record<string, keyof MeResponse>> = {
  DOCTOR: 'doctor',
  CLINIC_ADMIN: 'adminOfClinic',
};

export function RequireRole({
  requiredRole,
  children,
}: {
  requiredRole: string;
  children: React.ReactNode;
}) {
  const { me, loading } = useMe();
  const router = useRouter();

  const approvalField = APPROVAL_FIELD[requiredRole];
  const approvalEntity = approvalField
    ? (me?.[approvalField] as { approvalStatus: string } | null)
    : null;
  const isApproved =
    !approvalField || approvalEntity?.approvalStatus === 'APPROVED';

  useEffect(() => {
    if (loading || !me) return;

    if (me.role !== requiredRole) {
      router.replace('/');
      return;
    }

    if (!isApproved) {
      router.replace('/onboarding/pending');
    }
  }, [loading, me, requiredRole, isApproved, router]);

  const ready = !loading && !!me && me.role === requiredRole && isApproved;

  return (
    <ProtectedRoute>
      {ready ? (
        children
      ) : (
        <p className="py-16 text-center text-sm text-ink-muted">Loading...</p>
      )}
    </ProtectedRoute>
  );
}
