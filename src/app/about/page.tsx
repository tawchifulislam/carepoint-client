import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'About | CarePoint',
  description:
    'CarePoint is a doctor appointment platform that shows real availability and lets patients book and pay in one step.',
};

export default function AboutPage() {
  return (
    <LegalPage
      eyebrow="ABOUT"
      title="About CarePoint"
      intro="CarePoint is a doctor appointment platform. Patients see which times are actually open, book one, and pay in a single step."
    >
      <LegalSection title="For patients">
        <ul>
          <li>
            Search doctors by name, specialty, or clinic, and see each
            doctor&apos;s next available time.
          </li>
          <li>
            Pick a time from the doctor&apos;s real calendar and pay securely
            online.
          </li>
          <li>
            Reschedule or cancel from your dashboard. Cancelling at least two
            hours ahead refunds your payment.
          </li>
          <li>
            Get an email when your booking is confirmed and a reminder before
            the visit.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="For doctors and clinics">
        <ul>
          <li>
            Doctors set a weekly schedule, block days off, and see each
            day&apos;s appointments in one place.
          </li>
          <li>
            Doctors can mark visits as completed or no-show, and cancel an
            appointment with a full refund.
          </li>
          <li>
            Clinics register, approve the doctors who join them, and follow
            bookings and revenue.
          </li>
          <li>
            Every clinic and doctor is reviewed before they appear to patients.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How booking works">
        <p>
          A time is reserved the moment you start checkout and is held for 30
          minutes while you pay. Two people can never book the same slot, and a
          hold that is not paid in time is released automatically.
        </p>
      </LegalSection>

      <LegalSection title="How it is built">
        <p>
          It is built with Next.js, React, and Tailwind CSS on the front end,
          and Express, PostgreSQL with Prisma, Better Auth, Stripe, and Resend
          on the back end.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
