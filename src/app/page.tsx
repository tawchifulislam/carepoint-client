import {
  Activity,
  ArrowRight,
  Baby,
  Bone,
  Brain,
  CalendarCheck,
  CalendarDays,
  CircleCheck,
  Clock,
  Ear,
  Eye,
  Flower2,
  Heart,
  Lock,
  type LucideIcon,
  MessageCircleHeart,
  RotateCcw,
  Search,
  ShieldCheck,
  Smile,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/container';
import { CountUp } from '@/components/count-up';
import { LiveScheduleCard } from '@/components/live-schedule-card';
import { publicApiFetch } from '@/lib/api-server';
import { PRIMARY_BUTTON } from '@/lib/button-styles';

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

const HERO_TRUST = [
  { icon: ShieldCheck, label: 'Clinics and doctors are reviewed' },
  { icon: Lock, label: 'Secure online payment' },
  { icon: RotateCcw, label: 'Refund when you cancel 2h+ ahead' },
];

const TRUST_POINTS = [
  {
    icon: CalendarCheck,
    title: 'Real calendars, no double booking',
    body: 'Times come straight from each doctor’s schedule, and two people can never book the same slot.',
  },
  {
    icon: Clock,
    title: 'Your slot is held while you pay',
    body: 'A time is reserved the moment you start checkout and held for 30 minutes.',
  },
  {
    icon: ShieldCheck,
    title: 'Reviewed before they appear',
    body: 'Every clinic and doctor is reviewed before patients can see them.',
  },
  {
    icon: RotateCcw,
    title: 'Refunds when plans change',
    body: 'Cancel at least two hours ahead and your payment is refunded.',
  },
];

function specialtyIcon(name: string): LucideIcon {
  const key = name.toLowerCase();
  if (key.includes('cardio')) return Heart;
  if (key.includes('derma')) return Sparkles;
  if (key.includes('pedia')) return Baby;
  if (key.includes('ortho')) return Bone;
  if (key.includes('neuro')) return Brain;
  if (key.includes('psych')) return MessageCircleHeart;
  if (key.includes('gyne') || key.includes('obst')) return Flower2;
  if (key.includes('dent')) return Smile;
  if (key.includes('eye') || key.includes('ophth')) return Eye;
  if (key.includes('ent') || key.includes('ear')) return Ear;
  if (key.includes('general') || key.includes('family')) return Activity;
  return Stethoscope;
}

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
      <section className="relative -mt-18 overflow-hidden pt-18">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_75%_70%_at_50%_0%,#000_25%,transparent_75%)]" />
          <div className="absolute -right-24 -top-32 h-130 w-130 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -left-32 top-40 h-90 w-90 rounded-full bg-mint/15 blur-3xl" />
        </div>

        <Container className="relative">
          <div className="grid items-center gap-14 pb-20 pt-14 md:grid-cols-[1.08fr_0.92fr] md:pb-28 md:pt-20">
            <div className="animate-rise opacity-0">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-tint/80 px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-primary-hover">
                <span className="h-1.5 w-1.5 rounded-full bg-mint animate-pulse-soft" />
                REAL-TIME SCHEDULING
              </span>

              <h1 className="mt-6 max-w-xl text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-ink md:text-6xl">
                See the actual open slot.{' '}
                <span className="text-gradient">Book it.</span>
              </h1>

              <p className="mt-5 max-w-md text-[17px] text-ink-muted">
                No phone calls, no &quot;we&apos;ll get back to you.&quot;
                CarePoint shows you a clinic&apos;s real calendar and locks your
                slot the instant you pay.
              </p>

              <form
                action="/doctors"
                method="GET"
                className="mt-8 flex max-w-xl items-center gap-2 rounded-lg border border-border bg-surface p-2 shadow-lift transition focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              >
                <Search
                  aria-hidden="true"
                  className="ml-3 h-5 w-5 shrink-0 text-ink-muted"
                />
                <input
                  type="text"
                  name="search"
                  aria-label="Search doctors"
                  placeholder="Search by specialty, doctor, or clinic"
                  className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
                />
                <button type="submit" className={`${PRIMARY_BUTTON} px-6`}>
                  Search
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
                <span>Popular:</span>
                {specialties.slice(0, 4).map(item => (
                  <Link
                    key={item.name}
                    href={`/doctors?specialty=${encodeURIComponent(item.name)}`}
                    className="rounded-full border border-border bg-surface/80 px-3 py-1 font-medium text-ink transition-colors hover:border-primary/50 hover:text-primary-hover"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6">
                {HERO_TRUST.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-muted"
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative pb-6 md:pl-6">
              <LiveScheduleCard />
              <div className="absolute -bottom-10 -left-4 hidden items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 shadow-lift animate-float md:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mint-tint text-mint">
                  <Clock className="h-4.5 w-4.5" />
                </span>
                <div className="text-xs">
                  <div className="font-semibold text-ink">Slot held 30 min</div>
                  <div className="text-ink-muted">
                    while you complete payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {stats && stats.appointmentsBooked > 0 && (
        <section className="border-y border-border bg-surface">
          <Container className="grid gap-6 py-10 md:grid-cols-[auto_1fr] md:items-center md:gap-14">
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
                      className="shrink-0 rounded-full border border-border bg-paper px-4 py-2.5 text-[13px] text-ink-muted"
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

      <section className="py-20">
        <Container>
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold tracking-wide text-primary-hover">
                SPECIALTIES
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">
                Browse by specialty
              </h2>
            </div>
            <Link
              href="/doctors"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-ink-muted transition-colors hover:text-primary"
            >
              All doctors <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
            {specialties.map(item => {
              const Icon = specialtyIcon(item.name);

              return (
                <Link
                  key={item.name}
                  href={`/doctors?specialty=${encodeURIComponent(item.name)}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-ink">
                      {item.name}
                    </span>
                    {item.doctorCount !== null && (
                      <span className="block text-xs text-ink-muted">
                        {doctorLabel(item.doctorCount)}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-20">
        <Container>
          <p className="font-mono text-xs font-semibold tracking-wide text-primary-hover">
            HOW IT WORKS
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">
            Three steps, no phone calls
          </h2>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li
                key={title}
                className="relative overflow-hidden rounded-xl border border-border bg-paper p-7"
              >
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-3 font-mono text-6xl font-semibold text-primary-soft/70"
                >
                  0{i + 1}
                </span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-md bg-primary text-white shadow-card">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="relative mt-5 text-lg font-semibold text-ink">
                  {title}
                </h3>
                <p className="relative mt-1.5 max-w-60 text-sm text-ink-muted">
                  {body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="py-20">
        <Container className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="font-mono text-xs font-semibold tracking-wide text-primary-hover">
              WHY PATIENTS CAN TRUST IT
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink">
              Built so every booking is one you can rely on
            </h2>
            <p className="mt-4 max-w-sm text-[15px] text-ink-muted">
              Clear rules, shown up front, so you know exactly what happens when
              you book.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {TRUST_POINTS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-lg border border-border bg-surface p-6 shadow-card"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-tint text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-xl bg-night px-8 py-14 text-white md:px-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute inset-0 bg-grid-dark [mask-image:radial-gradient(ellipse_70%_90%_at_100%_0%,#000_20%,transparent_70%)]" />
              <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-primary/40 blur-3xl" />
            </div>

            <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-mono text-xs font-semibold tracking-wide text-[#7FF0D8]">
                  FOR CLINICS
                </p>
                <h2 className="mt-3 max-w-lg text-3xl font-bold tracking-tight md:text-4xl">
                  Run a clinic? Put your calendar online.
                </h2>
                <p className="mt-3 max-w-md text-[15px] text-white/70">
                  Publish real availability, take bookings and payments, and
                  stay in control of which doctors join.
                </p>
              </div>
              <Link
                href="/for-clinics"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-semibold text-ink transition hover:-translate-y-px hover:bg-primary-tint active:scale-[0.97]"
              >
                Learn more
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
