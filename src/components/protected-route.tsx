'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { signInHref } from '@/lib/auth-redirect';
import { useMe } from '@/lib/use-me';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { me, loading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !me) {
      router.replace(
        signInHref(`${window.location.pathname}${window.location.search}`),
      );
    }
  }, [loading, me, router]);

  if (loading || !me) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="flex justify-center py-24"
      >
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
