import type { Metadata } from 'next';
import Link from 'next/link';
import { ApplicationGate } from '@/components/application-gate';
import { ClinicApplicationForm } from './clinic-application-form';

export const metadata: Metadata = { title: 'Register your clinic | CarePoint' };

export default function ClinicOnboardingPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-ink">
        Register your clinic
      </h1>
      <p className="mt-2 text-ink-muted">
        Tell us about your clinic. The CarePoint team reviews every registration
        before it goes live.
      </p>

      <div className="mt-8">
        <ApplicationGate>
          <ClinicApplicationForm />
        </ApplicationGate>
      </div>

      <p className="mt-8 text-sm text-ink-muted">
        Are you a doctor?{' '}
        <Link
          href="/onboarding/doctor"
          className="font-semibold text-primary hover:underline"
        >
          Apply to join a clinic
        </Link>
      </p>
    </>
  );
}
