'use client';

import { CircleAlert } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/container';
import { PRIMARY_BUTTON, SECONDARY_LINK } from '@/lib/button-styles';

export default function DoctorsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Container className="py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-tint text-red ring-8 ring-red-tint/50">
        <CircleAlert className="h-7 w-7" />
      </span>
      <h1 className="mt-6 font-display text-2xl font-bold tracking-tight text-ink">
        Could not load doctors
      </h1>
      <p className="mt-2 text-sm text-ink-muted">
        Something went wrong while searching. Please try again.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={reset} className={PRIMARY_BUTTON}>
          Try again
        </button>
        <Link href="/" className={SECONDARY_LINK}>
          Back home
        </Link>
      </div>
    </Container>
  );
}
