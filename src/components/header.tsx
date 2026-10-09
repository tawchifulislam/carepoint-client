'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useMe } from '@/lib/use-me';
import { Container } from './container';

const DASHBOARD_PATHS: Record<string, string> = {
  PATIENT: '/dashboard',
  DOCTOR: '/doctor-portal',
  CLINIC_ADMIN: '/clinic-admin',
  SUPER_ADMIN: '/super-admin',
};

export function Header() {
  const { me, loading, signOutUser } = useMe();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const dashboardHref = me
    ? (DASHBOARD_PATHS[me.role] ?? '/dashboard')
    : '/dashboard';
  const solid = scrolled || menuOpen;

  return (
    <header
      className={`sticky top-0 z-20 border-b transition-colors duration-200 ${
        solid
          ? 'border-border bg-surface/90 backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-ink"
        >
          CarePoint
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-muted md:flex">
          <Link href="/doctors" className="transition-colors hover:text-ink">
            Find a Doctor
          </Link>
          <Link
            href="/for-clinics"
            className="transition-colors hover:text-ink"
          >
            For Clinics
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : me ? (
            <>
              <Link
                href={dashboardHref}
                className="rounded-sm px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOutUser()}
                className="rounded-sm border border-border px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-sm px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-[0.97]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(open => !open)}
          className="text-ink md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {menuOpen && (
        <div className="border-t border-border md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            <Link
              href="/doctors"
              onClick={() => setMenuOpen(false)}
              className="rounded-sm px-3 py-2.5 text-sm text-ink hover:bg-paper"
            >
              Find a Doctor
            </Link>
            <Link
              href="/for-clinics"
              onClick={() => setMenuOpen(false)}
              className="rounded-sm px-3 py-2.5 text-sm text-ink hover:bg-paper"
            >
              For Clinics
            </Link>

            <div className="mt-2 flex flex-col gap-1 border-t border-border pt-2">
              {loading ? null : me ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-sm px-3 py-2.5 text-sm text-ink hover:bg-paper"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOutUser();
                    }}
                    className="rounded-sm px-3 py-2.5 text-left text-sm text-ink hover:bg-paper"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-sm px-3 py-2.5 text-sm text-ink hover:bg-paper"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-sm bg-primary px-3 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
