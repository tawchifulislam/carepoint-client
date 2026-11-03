import { Lock, RotateCcw, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Container } from './container';
import { Logo } from './logo';

const PRODUCT_LINKS = [
  { href: '/doctors', label: 'Find a Doctor' },
  { href: '/for-clinics', label: 'For Clinics' },
  { href: '/sign-up', label: 'Create an account' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
];

const PROMISES = [
  { icon: ShieldCheck, label: 'Clinics and doctors are reviewed' },
  { icon: Lock, label: 'Secure online payment' },
  { icon: RotateCcw, label: 'Refund when you cancel 2h+ ahead' },
];

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-border bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent"
      />

      <Container className="grid grid-cols-2 gap-10 py-14 md:grid-cols-[1.4fr_0.6fr_0.6fr] md:gap-12">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" aria-label="CarePoint home" className="inline-block">
            <Logo />
          </Link>
          <p className="mt-4 max-w-xs text-sm text-ink-muted">
            Real doctor calendars, booked and paid in one step. No phone calls,
            no waiting for a reply.
          </p>

          <ul className="mt-6 space-y-2.5">
            {PROMISES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2.5 text-[13px] text-ink-muted"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-tint text-primary">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Product">
          <h2 className="font-mono text-xs font-semibold tracking-wide text-ink">
            PRODUCT
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {PRODUCT_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <h2 className="font-mono text-xs font-semibold tracking-wide text-ink">
            COMPANY
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {COMPANY_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-ink-muted transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col gap-2 py-5 text-xs text-ink-muted md:flex-row md:items-center md:justify-between">
          <span>&copy; {new Date().getFullYear()} CarePoint</span>
          <span>
            Payments are a demo and run in test mode, so no real money moves
          </span>
        </Container>
      </div>
    </footer>
  );
}
