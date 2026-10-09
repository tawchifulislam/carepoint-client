import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { Container } from '@/components/container';
import { PRIMARY_BUTTON, SECONDARY_LINK } from '@/lib/button-styles';

export const metadata: Metadata = {
  title: 'For Clinics | CarePoint',
  description:
    'List your doctors, publish real availability, and accept online bookings and payments.',
};

const BENEFITS = [
  {
    icon: CalendarClock,
    title: 'Publish real availability',
    body: 'Each doctor sets a weekly schedule and leave days. Patients only see slots that are genuinely open, and two patients can never book the same one.',
  },
  {
    icon: CreditCard,
    title: 'Get paid at booking',
    body: 'Patients pay the consultation fee online when they book. Cancellations made at least two hours ahead are refunded automatically.',
  },
  {
    icon: ShieldCheck,
    title: 'Stay in control',
    body: 'Your clinic and every doctor are reviewed before going live, and you decide which doctors join your clinic.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Register your clinic',
    body: 'Add your clinic name and address.',
  },
  {
    step: '02',
    title: 'Get reviewed',
    body: 'The CarePoint team approves verified clinics.',
  },
  {
    step: '03',
    title: 'Add your doctors',
    body: 'Approved doctors set their availability and start taking bookings.',
  },
];

export default function ForClinicsPage() {
  return (
    <>
      <section className="border-b border-border">
        <Container className="py-20 md:py-28">
          <p className="font-mono text-xs font-semibold tracking-wide text-primary-hover">
            FOR CLINICS
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
            Put your clinic&apos;s calendar online.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] text-ink-muted">
            Let patients see your doctors&apos; real availability, book a slot,
            and pay in one step, without a single phone call.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/onboarding/clinic" className={PRIMARY_BUTTON}>
              Register your clinic
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/onboarding/doctor" className={SECONDARY_LINK}>
              I am a doctor
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="grid gap-10 py-16 md:grid-cols-3 md:gap-12">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-t-2 border-primary pt-5">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
              <p className="mt-2 text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="pb-24 pt-16">
        <Container>
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            How it works
          </h2>

          <ol className="mt-8 divide-y divide-border border-y border-border">
            {STEPS.map(item => (
              <li
                key={item.step}
                className="grid gap-2 py-6 md:grid-cols-[120px_1fr_1.5fr] md:items-baseline md:gap-8"
              >
                <span className="font-mono text-sm text-ink-muted">
                  {item.step}
                </span>
                <h3 className="font-semibold text-ink">{item.title}</h3>
                <p className="text-sm text-ink-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
