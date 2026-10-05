import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/container';
import { publicApiFetch } from '@/lib/api-server';
import type { Paginated } from '@/types/pagination';

const SPECIALTIES = [
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'Gynecology',
  'Dentistry',
  'ENT',
  'Ophthalmology',
  'Urology',
  'General Medicine',
];

interface DoctorListItem {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  clinic: { id: string; name: string; address: string };
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; specialty?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;

  if (params.specialty) {
    return {
      title: `${params.specialty} Doctors | CarePoint`,
      description: `Find and book ${params.specialty} specialists near you.`,
    };
  }

  if (params.search) {
    return { title: `Search results for "${params.search}" | CarePoint` };
  }

  return {
    title: 'Find a Doctor | CarePoint',
    description:
      'Search verified doctors by specialty and book a real-time appointment.',
  };
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; specialty?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? '';
  const specialty = params.specialty ?? '';
  const page = params.page ?? '1';

  const query = new URLSearchParams();
  if (search) query.set('search', search);
  if (specialty) query.set('specialty', specialty);
  query.set('page', page);

  const result = await publicApiFetch<Paginated<DoctorListItem>>(
    `/api/doctors?${query.toString()}`,
  );

  function buildHref(overrides: Record<string, string>) {
    const next = new URLSearchParams(query);
    for (const [key, value] of Object.entries(overrides)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    return `/doctors?${next.toString()}`;
  }

  return (
    <Container className="grid gap-8 py-12 md:grid-cols-[220px_1fr]">
      <aside>
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-ink-muted">
          Specialty
        </h2>
        <div className="mt-4 flex flex-col gap-1">
          <Link
            href={buildHref({ specialty: '', page: '1' })}
            className={`rounded-sm px-3 py-2 text-sm ${!specialty ? 'bg-primary-tint text-primary' : 'text-ink hover:bg-paper'}`}
          >
            All specialties
          </Link>
          {SPECIALTIES.map(item => (
            <Link
              key={item}
              href={buildHref({ specialty: item, page: '1' })}
              className={`rounded-sm px-3 py-2 text-sm ${specialty === item ? 'bg-primary-tint text-primary' : 'text-ink hover:bg-paper'}`}
            >
              {item}
            </Link>
          ))}
        </div>
      </aside>

      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {result.total} doctor{result.total === 1 ? '' : 's'} available
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {result.data.map(doctor => (
            <Link
              key={doctor.id}
              href={`/doctors/${doctor.id}`}
              className="rounded-md border border-border bg-surface p-5 shadow-card hover:border-primary"
            >
              <h3 className="font-display text-lg font-medium text-ink">
                {doctor.name}
              </h3>
              <p className="text-sm text-ink-muted">{doctor.specialty}</p>
              <p className="mt-2 text-sm text-ink">{doctor.clinic.name}</p>
              <p className="mt-3 font-mono text-sm text-primary">
                ${doctor.consultationFee}
              </p>
            </Link>
          ))}
        </div>

        {result.data.length === 0 && (
          <p className="mt-8 text-sm text-ink-muted">
            No doctors match your search.
          </p>
        )}

        {result.totalPages > 1 && (
          <div className="mt-8 flex gap-2">
            {Array.from({ length: result.totalPages }, (_, i) => i + 1).map(
              p => (
                <Link
                  key={p}
                  href={buildHref({ page: String(p) })}
                  className={`rounded-sm px-3 py-2 text-sm font-mono ${p === result.page ? 'bg-primary text-white' : 'border border-border text-ink hover:bg-paper'}`}
                >
                  {p}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </Container>
  );
}
