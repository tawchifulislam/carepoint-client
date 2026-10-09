import type { Metadata } from 'next';
import { ApplicationStatus } from './application-status';

export const metadata: Metadata = { title: 'Application status | CarePoint' };

export default function OnboardingPendingPage() {
  return <ApplicationStatus />;
}
