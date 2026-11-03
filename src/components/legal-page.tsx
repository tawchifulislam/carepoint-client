import { CreditCard } from 'lucide-react';
import { Container } from './container';

export function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_100%_at_80%_0%,#000_20%,transparent_70%)]"
        />
        <Container className="relative py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            {eyebrow && (
              <p className="font-mono text-xs font-semibold tracking-wide text-primary-hover">
                {eyebrow}
              </p>
            )}
            <h1
              className={`text-3xl font-bold tracking-tight text-ink md:text-5xl ${eyebrow ? 'mt-3' : ''}`}
            >
              {title}
            </h1>
            <p className="mt-4 text-lg text-ink-muted">{intro}</p>
            {updated && (
              <p className="mt-2 text-sm text-ink-muted">
                Last updated {updated}
              </p>
            )}
          </div>
        </Container>
      </section>

      <Container className="py-10 md:py-14">
        <article className="mx-auto max-w-3xl">
          <div
            role="note"
            className="flex gap-3 rounded-lg border border-amber/30 bg-amber-tint px-5 py-4 text-sm text-ink"
          >
            <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
            <p>
              Payments on CarePoint are a demo. They run in test mode, so no
              real money moves.
            </p>
          </div>

          <div className="mt-8 space-y-5">{children}</div>
        </article>
      </Container>
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-surface p-6 shadow-card sm:p-7">
      <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-ink">
        <span
          aria-hidden="true"
          className="h-5 w-1 shrink-0 rounded-full bg-primary"
        />
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-ink-muted [&_a:hover]:underline [&_a]:font-semibold [&_a]:text-primary [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
