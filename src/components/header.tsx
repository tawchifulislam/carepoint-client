'use client';

import Link from 'next/link';
import { signOut } from '@/lib/auth-client';
import { useMe } from '@/lib/use-me';
import { Container } from './container';

const DASHBOARD_PATHS: Record<string, string> = {
  PATIENT: '/dashboard',
  DOCTOR: '/doctor-portal',
  CLINIC_ADMIN: '/clinic-admin',
  SUPER_ADMIN: '/super-admin',
};

export function Header() {
  const { me, loading } = useMe();

  const dashboardHref = me
    ? (DASHBOARD_PATHS[me.role] ?? '/dashboard')
    : '/dashboard';

  return (
    <header className="border-b border-border bg-surface">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-xl font-semibold text-ink">
          CarePoint
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-muted md:flex">
          <Link href="/doctors" className="hover:text-ink">
            Find a Doctor
          </Link>
          <Link href="/for-clinics" className="hover:text-ink">
            For Clinics
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? null : me ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-sm px-3 py-2 text-sm font-medium text-ink hover:bg-paper"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-sm border border-border px-3 py-2 text-sm font-medium text-ink hover:bg-paper"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-sm px-3 py-2 text-sm font-medium text-ink hover:bg-paper"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-sm bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </Container>
    </header>
  );
}
