import Link from 'next/link';
import { ArrowRight, CalendarDays, CircleCheck, Search } from 'lucide-react';
import { Container } from '@/components/container';
import { CountUp } from '@/components/count-up';
import { LiveScheduleCard } from '@/components/live-schedule-card';
import { publicApiFetch } from '@/lib/api-server';

interface PublicStats {
  appointmentsBooked: number;
  specialties: { name: string; doctorCount: number }[];
}

interface SpecialtyItem {
  name: string;
  doctorCount: number | null;
}

const FALLBACK_SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'Gynecology',
  'Dentistry',
];

const STEPS = [
  {
    icon: Search,
    title: 'Search',
    body: 'Find a doctor by specialty, name, or clinic.',
  },
  {
    icon: CalendarDays,
    title: 'Book',
    body: 'Pick an open slot and pay securely online.',
  },
  {
    icon: CircleCheck,
    title: 'Consult',
    body: 'Get a confirmation email and show up for your visit.',
  },
];

async function loadStats(): Promise<PublicStats | null> {
  try {
    return await publicApiFetch<PublicStats>('/api/stats', 60);
  } catch {
    return null;
  }
}

function doctorLabel(count: number): string {
  return `${count} ${count === 1 ? 'doctor' : 'doctors'}`;
}

export default async function HomePage() {
  const stats = await loadStats();

  const specialties: SpecialtyItem[] = stats?.specialties.length
    ? stats.specialties
    : FALLBACK_SPECIALTIES.map(name => ({ name, doctorCount: null }));

  const marqueeBase = (stats?.specialties ?? []).slice(0, 8);
  const marqueeItems =
    marqueeBase.length > 0
      ? Array.from({ length: Math.ceil(8 / marqueeBase.length) }).flatMap(
          () => marqueeBase,
        )
      : [];

  return (
    <>
      <section className="relative pt-12">
        <Container>
          <div className="grid items-start md:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-rise pb-10 pt-14 opacity-0 md:pb-40">
              <p className="font-mono text-xs font-semibold tracking-wide text-primary-hover">
                REAL-TIME SCHEDULING
              </p>
              <h1 className="mt-4 max-w-130 text-4xl font-extrabold leading-[1.02] tracking-tight text-ink md:text-6xl">
                See the actual
                <br />
                open slot. Book it.
              </h1>
              <p className="mt-5 max-w-100 text-[17px] text-ink-muted">
                No phone calls, no &quot;we&apos;ll get back to you.&quot;
                CarePoint shows you a clinic&apos;s real calendar and locks your
                slot the instant you pay.
              </p>
            </div>

            <LiveScheduleCard />
          </div>
        </Container>

        <div className="mx-auto mt-8 max-w-170 px-6 md:-mt-18">
          <form
            action="/doctors"
            method="GET"
            className="relative z-10 flex gap-1.5 rounded-lg border border-border bg-surface p-2 opacity-0 shadow-[0_16px_40px_rgb(18_29_40/0.12)] animate-rise [animation-delay:300ms] focus-within:border-primary"
          >
            <input
              type="text"
              name="search"
              aria-label="Search doctors"
              placeholder="Search by specialty, doctor, or clinic"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
            />
            <button
              type="submit"
              className="whitespace-nowrap rounded-sm bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-[0.97]"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      {stats && stats.appointmentsBooked > 0 && (
        <section className="border-b border-border pb-20 pt-24 md:pt-36">
          <Container className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
            <div>
              <div className="font-mono text-5xl font-semibold text-ink">
                <CountUp value={stats.appointmentsBooked} />
              </div>
              <p className="mt-1 text-[13px] text-ink-muted">
                appointments booked
              </p>
            </div>

            {marqueeItems.length > 0 && (
              <div className="overflow-hidden mask-[linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
                <div className="flex w-max animate-marquee gap-3">
                  {[...marqueeItems, ...marqueeItems].map((item, i) => (
                    <div
                      key={i}
                      aria-hidden={i >= marqueeItems.length}
                      className="shrink-0 rounded-md border border-border bg-surface px-4 py-2.5 text-[13px] text-ink-muted"
                    >
                      <strong className="font-semibold text-ink">
                        {item.name}
                      </strong>{' '}
                      &middot; {doctorLabel(item.doctorCount)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Container>
        </section>
      )}

      <section className="border-b border-border py-20">
        <Container>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-ink">
              Browse by specialty
            </h2>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1 text-[13px] text-ink-muted transition-colors hover:text-ink"
            >
              All doctors <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex snap-x snap-mandatory gap-3.5 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
            {specialties.map(item => (
              <Link
                key={item.name}
                href={`/doctors?specialty=${encodeURIComponent(item.name)}`}
                className="w-45 shrink-0 snap-start rounded-lg border border-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-primary"
              >
                <div className="text-[15px] font-semibold text-ink">
                  {item.name}
                </div>
                {item.doctorCount !== null && (
                  <div className="mt-1 text-xs text-ink-muted">
                    {doctorLabel(item.doctorCount)}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24 pt-20">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            How it works
          </h2>

          <div className="relative mt-14 grid gap-8 md:grid-cols-3 md:before:absolute md:before:left-[8%] md:before:right-[8%] md:before:top-4.75 md:before:h-0.5 md:before:bg-border">
            {STEPS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="relative px-4 text-center">
                <div className="relative mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-surface text-primary">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-semibold text-ink">{title}</h3>
                <p className="mx-auto mt-1.5 max-w-55 text-[13px] text-ink-muted">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
