import { Container } from '@/components/container';

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
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-xl border border-border bg-surface shadow-card lg:grid-cols-[0.9fr_1.1fr]">
        <aside
          aria-hidden="true"
          className="hidden flex-col justify-between bg-ink p-12 text-white lg:flex"
        >
          <div>
            <p className="font-mono text-xs font-semibold tracking-wide text-primary-tint/80">
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

          <div className="space-y-2">
            {PREVIEW_ROWS.map(row => (
              <div
                key={row.time}
                className={`flex items-center justify-between rounded-md px-4 py-3 text-sm ${
                  row.open ? 'bg-white/10' : 'bg-white/5 text-white/40'
                }`}
              >
                <span className="font-mono">{row.time}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    row.open
                      ? 'bg-primary text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  {row.open ? 'OPEN' : 'BOOKED'}
                </span>
              </div>
            ))}
          </div>
        </aside>

        <div className="mx-auto w-full max-w-md px-6 py-10 sm:px-10 sm:py-14 lg:max-w-none lg:px-14">
          {children}
        </div>
      </div>
    </Container>
  );
}
