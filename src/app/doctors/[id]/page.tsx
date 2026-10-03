import { notFound } from 'next/navigation';
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
    <Container className="py-12">
      <div className="flex flex-col gap-2 border-b border-border pb-8 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            {doctor.name}
          </h1>
          <p className="mt-1 text-ink-muted">{doctor.specialty}</p>
          <p className="mt-3 text-sm text-ink">{doctor.clinic.name}</p>
          <p className="text-sm text-ink-muted">{doctor.clinic.address}</p>
          {doctor.bio && (
            <p className="mt-4 max-w-xl text-sm text-ink">{doctor.bio}</p>
          )}
        </div>
        <div className="font-mono text-2xl text-primary">
          ${doctor.consultationFee}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold text-ink">
          Available slots
        </h2>
        <SlotPicker doctorId={doctor.id} />
      </div>
    </Container>
  );
}
