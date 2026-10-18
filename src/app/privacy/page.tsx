import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, LegalSection } from '@/components/legal-page';
import { PRIVACY_UPDATED } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy | CarePoint',
  description: 'What CarePoint stores, who can see it, and how it is used.',
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      intro="A plain description of what this demo stores, who can see it, and how it is used."
      updated={PRIVACY_UPDATED}
    >
      <LegalSection title="Please use test data only">
        <p>
          CarePoint is a demo. Do not enter real personal or medical
          information. Accounts and bookings can be reset or deleted at any
          time, and there is no self-service way to delete an account yet.
        </p>
      </LegalSection>

      <LegalSection title="What we store">
        <ul>
          <li>
            <strong>Account details:</strong> your name, your email address, and
            a one-way hash of your password. The password itself is never
            stored.
          </li>
          <li>
            <strong>Appointments:</strong> the doctor, the time, and the status
            of each booking. CarePoint does not store medical records or notes.
          </li>
          <li>
            <strong>Payments:</strong> the amount, the status, and Stripe&apos;s
            reference for each payment. Your card number is entered on
            Stripe&apos;s page and never reaches our servers.
          </li>
          <li>
            <strong>Applications:</strong> if you register a clinic or apply as
            a doctor, what you submit, such as the clinic name and address, your
            specialty, consultation fee, and bio.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="How it is used">
        <p>
          Only to run the service: signing you in, showing and managing
          bookings, taking payments and issuing refunds, and sending emails
          about your appointments and password resets. We do not sell or rent
          personal data, and the app shows no ads.
        </p>
      </LegalSection>

      <LegalSection title="Who can see what">
        <ul>
          <li>
            Doctors see the name of the patients booked with them and the
            appointment times.
          </li>
          <li>
            Clinic administrators see the doctors at their clinic and booking
            and revenue totals, not patient details.
          </li>
          <li>
            Platform administrators review clinic and doctor applications,
            including the applicant&apos;s name and email.
          </li>
          <li>
            Anyone can see an approved doctor&apos;s public profile: name,
            specialty, fee, bio, and the clinic&apos;s name and address.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Services we use">
        <p>
          Stripe processes payments, Resend delivers email, and infrastructure
          providers host the app and its database. Each receives the data needed
          to do its part, for example Stripe receives payment details and Resend
          receives email addresses and message content.
        </p>
      </LegalSection>

      <LegalSection title="Your browser and your password">
        <p>
          To keep you signed in, a session token is kept in your browser&apos;s
          local storage, and signing out removes it. The app itself includes no
          advertising or analytics trackers.
        </p>
        <p>
          Password reset links work once and expire after 30 minutes. Resetting
          your password signs you out everywhere.
        </p>
      </LegalSection>

      <LegalSection title="Questions">
        <p>
          See the <Link href="/contact">contact page</Link>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
