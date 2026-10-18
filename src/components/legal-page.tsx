import { Info } from 'lucide-react';
import { Container } from './container';

export function LegalPage({
  title,
  intro,
  updated,
  children,
}: {
  title: string;
  intro: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="py-14 md:py-20">
      <article className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink md:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-ink-muted">{intro}</p>
        {updated && (
          <p className="mt-2 text-sm text-ink-muted">Last updated {updated}</p>
        )}

        <div
          role="note"
          className="mt-8 flex gap-3 rounded-lg border border-amber bg-amber-tint px-5 py-4 text-sm text-ink"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber" />
          <p>
            CarePoint is a portfolio project, not a real medical service. Use
            test data only, and treat any contact details on this site as
            placeholders.
          </p>
        </div>

        <div className="mt-10 space-y-10">{children}</div>
      </article>
    </Container>
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
    <section>
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-7 text-ink-muted [&_a:hover]:underline [&_a]:font-semibold [&_a]:text-primary [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
