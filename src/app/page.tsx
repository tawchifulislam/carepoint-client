import Link from 'next/link';
import { CalendarCheck, ShieldCheck, BadgeCheck } from 'lucide-react';
import { Container } from '@/components/container';

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'Gynecology',
  'Dentistry',
];

const MOCK_SLOTS = [
  { day: 'Mon', time: '9:00', status: 'open' },
  { day: 'Mon', time: '9:30', status: 'open' },
  { day: 'Mon', time: '10:00', status: 'pending' },
  { day: 'Tue', time: '9:00', status: 'open' },
  { day: 'Tue', time: '9:30', status: 'booked' },
  { day: 'Tue', time: '10:00', status: 'open' },
  { day: 'Wed', time: '9:00', status: 'open' },
  { day: 'Wed', time: '9:30', status: 'open' },
  { day: 'Wed', time: '10:00', status: 'open' },
];

function slotClass(status: string) {
  if (status === 'pending') return 'bg-amber-tint text-amber';
  if (status === 'booked') return 'bg-border text-ink-muted';
  return 'bg-primary-tint text-primary';
}

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="grid gap-12 py-20 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-tight text-ink">
              Book a doctor&apos;s appointment in minutes
            </h1>
            <p className="mt-4 text-lg text-ink-muted">
              Real-time availability, verified clinics, and secure payments, all
              in one place.
            </p>

            <form action="/doctors" method="GET" className="mt-8 flex gap-2">
              <input
                type="text"
                name="search"
                placeholder="Search by specialty or doctor name"
                className="flex-1 rounded-sm border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted"
              />
              <button
                type="submit"
                className="rounded-sm bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover active:scale-[0.98]"
              >
                Search
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-border bg-surface p-6 shadow-card">
            <div className="grid grid-cols-3 gap-2 font-mono text-xs">
              {MOCK_SLOTS.map((slot, i) => (
                <div
                  key={i}
                  className={`rounded-sm px-2 py-3 text-center ${slotClass(slot.status)}`}
                >
                  <div className="font-medium">{slot.day}</div>
                  <div>{slot.time}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="grid gap-8 py-16 md:grid-cols-3">
          <div className="border-l-2 border-primary pl-4">
            <CalendarCheck className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display text-lg font-medium text-ink">
              Real-time availability
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              See exactly which slots are open, no back-and-forth.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display text-lg font-medium text-ink">
              Secure payments via Stripe
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              Pay for your consultation at the time of booking.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <h3 className="mt-3 font-display text-lg font-medium text-ink">
              Verified clinics & doctors
            </h3>
            <p className="mt-1 text-sm text-ink-muted">
              Every listing is reviewed before it goes live.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="py-16">
          <h2 className="font-display text-2xl font-semibold text-ink">
            Browse by specialty
          </h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {SPECIALTIES.map(specialty => (
              <Link
                key={specialty}
                href={`/doctors?specialty=${encodeURIComponent(specialty)}`}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink hover:border-primary hover:text-primary"
              >
                {specialty}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="grid gap-8 py-16 md:grid-cols-3">
          {[
            {
              step: '01',
              title: 'Search',
              body: 'Find a doctor by specialty, name, or clinic.',
            },
            {
              step: '02',
              title: 'Book',
              body: 'Pick an open slot and pay securely online.',
            },
            {
              step: '03',
              title: 'Consult',
              body: 'Get a confirmation email and show up for your visit.',
            },
          ].map(item => (
            <div key={item.step}>
              <span className="font-mono text-sm text-ink-muted">
                {item.step}
              </span>
              <h3 className="mt-2 font-display text-lg font-medium text-ink">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-ink-muted">{item.body}</p>
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
