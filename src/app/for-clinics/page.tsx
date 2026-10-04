import Link from 'next/link';
import { Container } from '@/components/container';

export default function ForClinicsPage() {
  return (
    <Container className="py-16 text-center">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Bring your clinic online
      </h1>
      <p className="mx-auto mt-3 max-w-md text-ink-muted">
        List your doctors, manage availability, and accept online payments, all
        in one place.
      </p>
      <Link
        href="/onboarding/clinic"
        className="mt-6 inline-block rounded-sm bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Register your clinic
      </Link>
    </Container>
  );
}
