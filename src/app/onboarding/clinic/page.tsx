import type { Metadata } from 'next';
import Link from 'next/link';
import { ApplicationGate } from '@/components/application-gate';
import { PageHeader } from '@/components/page-header';
import { ClinicApplicationForm } from './clinic-application-form';

export const metadata: Metadata = { title: 'Register your clinic | CarePoint' };

export default function ClinicOnboardingPage() {
  return (
    <>
      <PageHeader
        eyebrow="FOR CLINICS"
        title="Register your clinic"
        description="Tell us about your clinic. The CarePoint team reviews every registration before it goes live."
      />

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
