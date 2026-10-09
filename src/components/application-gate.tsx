'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMe } from '@/lib/use-me';

export function ApplicationGate({ children }: { children: React.ReactNode }) {
  const { me } = useMe();
  const router = useRouter();

  const hasApplication = Boolean(me?.doctor || me?.adminOfClinic);

  useEffect(() => {
    if (hasApplication) {
      router.replace('/onboarding/pending');
    }
  }, [hasApplication, router]);

  if (!me || hasApplication) {
    return null;
  }

  if (me.role !== 'PATIENT') {
    return (
      <div className="rounded-xl border border-border bg-surface p-8 text-center shadow-card">
        <h2 className="text-lg font-semibold text-ink">
          This account cannot apply
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Applications are only available to patient accounts. Sign in with a
          patient account to continue.
        </p>
        <Link
          href="/"
          className="mt-5 inline-block text-sm font-semibold text-primary hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
