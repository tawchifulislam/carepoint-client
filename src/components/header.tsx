'use client';

import { ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMe } from '@/lib/use-me';
import { Container } from './container';
import { Logo } from './logo';

const DASHBOARD_PATHS: Record<string, string> = {
  PATIENT: '/dashboard',
  DOCTOR: '/doctor-portal',
  CLINIC_ADMIN: '/clinic-admin',
  SUPER_ADMIN: '/super-admin',
};

const NAV_LINKS = [
  { href: '/doctors', label: 'Find a Doctor' },
  { href: '/for-clinics', label: 'For Clinics' },
];

const GHOST_LINK =
  'rounded-sm px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5';
const OUTLINE_BUTTON =
  'rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary/50 hover:text-primary-hover';
const CTA_LINK =
  'rounded-sm bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgb(10_112_136/0.65)] transition hover:-translate-y-px hover:bg-primary-hover active:scale-[0.97]';
const MOBILE_ROW =
  'flex items-center justify-between rounded-md px-4 py-3.5 text-[15px] font-medium text-ink transition-colors hover:bg-primary-tint';

export function Header() {
  const { me, loading, signOutUser } = useMe();
  const pathname = usePathname();
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

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  const dashboardHref = me
    ? (DASHBOARD_PATHS[me.role] ?? '/dashboard')
    : '/dashboard';
  const solid = scrolled || menuOpen;

  return (
    <header
      className={`sticky top-0 z-20 border-b transition-[background-color,box-shadow,border-color] duration-200 ${
        solid
          ? 'border-border bg-surface/85 shadow-[0_8px_24px_-16px_rgb(10_26_37/0.25)] backdrop-blur-xl'
          : 'border-transparent bg-transparent'
      }`}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <Link href="/" aria-label="CarePoint home" className="rounded-md">
          <Logo />
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 text-sm font-medium md:flex"
        >
          {NAV_LINKS.map(link => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-2 transition-colors ${
                  active
                    ? 'bg-primary-tint text-primary-hover'
                    : 'text-ink-muted hover:bg-primary-tint hover:text-primary-hover'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : me ? (
            <>
              <Link href={dashboardHref} className={GHOST_LINK}>
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOutUser()}
                className={OUTLINE_BUTTON}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className={GHOST_LINK}>
                Sign in
              </Link>
              <Link href="/sign-up" className={CTA_LINK}>
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(open => !open)}
          className="-mr-2 flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-ink/5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-surface md:hidden"
        >
          <Container className="flex flex-col gap-1 py-4">
            {me && (
              <p className="px-4 pb-2 text-xs text-ink-muted">
                Signed in as{' '}
                <span className="font-semibold text-ink">{me.name}</span>
              </p>
            )}

            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={MOBILE_ROW}
              >
                {link.label}
                <ChevronRight className="h-4 w-4 text-ink-muted" />
              </Link>
            ))}

            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              {loading ? null : me ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setMenuOpen(false)}
                    className={MOBILE_ROW}
                  >
                    Dashboard
                    <ChevronRight className="h-4 w-4 text-ink-muted" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      signOutUser();
                    }}
                    className="rounded-sm border border-border px-4 py-3.5 text-center text-[15px] font-semibold text-ink transition-colors hover:border-primary/50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-sm border border-border px-4 py-3.5 text-center text-[15px] font-semibold text-ink transition-colors hover:border-primary/50"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/sign-up"
                    onClick={() => setMenuOpen(false)}
                    className="rounded-sm bg-primary px-4 py-3.5 text-center text-[15px] font-semibold text-white shadow-[0_8px_18px_-8px_rgb(10_112_136/0.65)] hover:bg-primary-hover"
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
