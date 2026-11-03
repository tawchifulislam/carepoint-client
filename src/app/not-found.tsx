import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/container';
import { LogoMark } from '@/components/logo';
import { PRIMARY_BUTTON, SECONDARY_LINK } from '@/lib/button-styles';

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_80%_at_50%_30%,#000_20%,transparent_70%)]"
      />
      <Container className="relative py-24 text-center md:py-32">
        <LogoMark className="mx-auto h-14 w-14" />
        <p className="mt-8 font-mono text-sm font-semibold tracking-wide text-primary-hover">
          404
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
          This page isn&apos;t on the schedule.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-muted">
          The page you are looking for may have moved or never existed.
          Let&apos;s get you back to something useful.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={PRIMARY_BUTTON}>
            Back to home
          </Link>
          <Link href="/doctors" className={SECONDARY_LINK}>
            Find a doctor
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
