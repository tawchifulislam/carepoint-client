import { ArrowLeft, Clock, Lock, MapPin, RotateCcw } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Avatar } from '@/components/avatar';
import { Container } from '@/components/container';
import { publicApiFetch } from '@/lib/api-server';
import { SlotPicker } from './slot-picker';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  bio: string | null;
  clinic: { id: string; name: string; address: string };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const doctor = await publicApiFetch<Doctor>(`/api/doctors/${id}`, 300);
    return {
      title: `${doctor.name} - ${doctor.specialty} | CarePoint`,
      description: `Book an appointment with ${doctor.name}, ${doctor.specialty} at ${doctor.clinic.name}.`,
    };
  } catch {
    return { title: 'Doctor not found | CarePoint' };
  }
}

const GUARANTEES = [
  { icon: Lock, label: 'Secure online payment' },
  { icon: Clock, label: 'Slot held 30 min while you pay' },
  { icon: RotateCcw, label: 'Refund when you cancel 2h+ ahead' },
];

export default async function DoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let doctor: Doctor;
  try {
    doctor = await publicApiFetch<Doctor>(`/api/doctors/${id}`, 300);
  } catch {
    notFound();
  }

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_100%_at_85%_0%,#000_20%,transparent_70%)]"
        />
        <Container className="relative py-8 md:py-12">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            All doctors
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 sm:gap-5">
              <Avatar
                name={doctor.name}
                className="h-16 w-16 text-xl sm:h-20 sm:w-20 sm:text-2xl"
              />
              <div className="min-w-0">
                <h1 className="font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
                  {doctor.name}
                </h1>
                <p className="mt-2 inline-flex rounded-full bg-primary-tint px-3 py-1 text-sm font-semibold text-primary-hover">
                  {doctor.specialty}
                </p>
                <p className="mt-4 flex items-start gap-2 text-sm text-ink-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    <span className="font-medium text-ink">
                      {doctor.clinic.name}
                    </span>
                    <br />
                    {doctor.clinic.address}
                  </span>
                </p>
                {doctor.bio && (
                  <p className="mt-4 max-w-xl text-[15px] leading-7 text-ink">
                    {doctor.bio}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-surface px-6 py-4 shadow-card md:min-w-44 md:text-center">
              <p className="text-xs font-medium text-ink-muted">
                Consultation fee
              </p>
              <p className="mt-1 font-mono text-3xl font-semibold text-primary">
                ${doctor.consultationFee}
              </p>
            </div>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6">
            {GUARANTEES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 text-[13px] font-medium text-ink-muted"
              >
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Container className="py-10 md:py-12">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
          Available slots
        </h2>
        <div className="mt-6">
          <SlotPicker
            doctorId={doctor.id}
            consultationFee={doctor.consultationFee}
          />
        </div>
      </Container>
    </>
  );
}
