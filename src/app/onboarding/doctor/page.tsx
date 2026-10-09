import type { Metadata } from 'next';
import Link from 'next/link';
import { ApplicationGate } from '@/components/application-gate';
import { DoctorApplicationForm } from './doctor-application-form';

export const metadata: Metadata = { title: 'Apply as a doctor | CarePoint' };

export default function DoctorOnboardingPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Apply as a doctor
      </h1>
      <p className="mt-2 text-ink-muted">
        Choose the clinic you work with. Its administrator reviews your
        application before you can take bookings.
      </p>

      <div className="mt-8">
        <ApplicationGate>
          <DoctorApplicationForm />
        </ApplicationGate>
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        Registering a clinic instead?{' '}
        <Link
          href="/onboarding/clinic"
          className="font-semibold text-primary hover:underline"
        >
          Register your clinic
        </Link>
      </p>
    </>
  );
}
