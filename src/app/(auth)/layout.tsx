import { Check, Lock, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/container';
import { Logo } from '@/components/logo';

const PREVIEW_ROWS = [
  { time: '09:00', open: true },
  { time: '09:30', open: false },
  { time: '10:00', open: true },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="py-10 md:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-xl border border-border bg-surface shadow-lift lg:grid-cols-[0.9fr_1.1fr]">
        <aside
          aria-hidden="true"
          className="relative hidden flex-col justify-between gap-10 overflow-hidden bg-night p-12 text-white lg:flex"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-grid-dark mask-[radial-gradient(ellipse_90%_70%_at_0%_0%,#000_20%,transparent_75%)]" />
            <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-primary/40 blur-3xl" />
          </div>

          <div className="relative">
            <Logo tone="light" />
            <p className="mt-12 font-mono text-xs font-semibold tracking-wide text-[#7FF0D8]">
              REAL-TIME SCHEDULING
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight">
              Book the actual open slot.
            </h2>
            <p className="mt-4 max-w-xs text-sm text-white/70">
              Real calendars from verified clinics, and a payment that locks
              your time.
            </p>
          </div>

          <div className="relative space-y-6">
            <div className="space-y-2">
              {PREVIEW_ROWS.map(row => (
                <div
                  key={row.time}
                  className={`flex items-center justify-between rounded-md border px-4 py-3 text-sm ${
                    row.open
                      ? 'border-white/15 bg-white/10'
                      : 'border-transparent bg-white/5 text-white/40'
                  }`}
                >
                  <span className="font-mono">{row.time}</span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      row.open
                        ? 'bg-primary text-white'
                        : 'bg-white/10 text-white/50'
                    }`}
                  >
                    {row.open ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    {row.open ? 'OPEN' : 'BOOKED'}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-white/60">
              <ShieldCheck className="h-4 w-4 text-[#7FF0D8]" />
              Payments are handled securely by Stripe
            </div>
          </div>
        </aside>

        <div className="mx-auto w-full max-w-md px-6 py-10 sm:px-10 sm:py-14 lg:max-w-none lg:px-14">
          {children}
        </div>
      </div>
    </Container>
  );
}
