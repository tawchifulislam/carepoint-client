'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ProtectedRoute } from './protected-route';
import { useMe, type MeResponse } from '@/lib/use-me';

const APPROVAL_FIELD: Partial<Record<string, keyof MeResponse>> = {
  DOCTOR: 'doctor',
  CLINIC_ADMIN: 'adminOfClinic',
};

export function RequireRole({
  role,
  children,
}: {
  role: string;
  children: React.ReactNode;
}) {
  const { me, loading } = useMe();
  const router = useRouter();

  const approvalField = APPROVAL_FIELD[role];
  const approvalEntity = approvalField
    ? (me?.[approvalField] as { approvalStatus: string } | null)
    : null;
  const isApproved =
    !approvalField || approvalEntity?.approvalStatus === 'APPROVED';

  useEffect(() => {
    if (loading || !me) return;

    if (me.role !== role) {
      router.replace('/');
      return;
    }

    if (!isApproved) {
      router.replace('/onboarding/pending');
    }
  }, [loading, me, role, isApproved, router]);

  const ready = !loading && !!me && me.role === role && isApproved;

  return (
    <ProtectedRoute>
      {!ready ? (
        <p className="py-16 text-center text-ink-muted">Loading...</p>
      ) : (
        children
      )}
    </ProtectedRoute>
  );
}
