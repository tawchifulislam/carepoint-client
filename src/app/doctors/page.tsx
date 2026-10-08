import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Container } from '@/components/container';
import { publicApiFetch } from '@/lib/api-server';
import { formatNextAvailable } from '@/lib/format';
import type { Paginated } from '@/types/pagination';

interface DoctorListItem {
  id: string;
  name: string;
  specialty: string;
  consultationFee: number;
  nextAvailableSlot: string | null;
  clinic: { id: string; name: string; address: string };
}

interface SpecialtySummary {
  name: string;
  doctorCount: number;
}

interface SearchState {
  search: string;
  specialty: string;
}

const CHIP_BASE =
  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors';
const CHIP_ACTIVE = 'border-primary bg-primary text-white';
const CHIP_IDLE =
  'border-border bg-surface text-ink hover:border-primary hover:text-primary-hover';
const PAGE_LINK =
  'inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-primary';

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

function buildHref({ search, specialty }: SearchState, page = 1): string {
  const query = new URLSearchParams();

  if (search) query.set('search', search);
  if (specialty) query.set('specialty', specialty);
  if (page > 1) query.set('page', String(page));

  const queryString = query.toString();
  return queryString ? `/doctors?${queryString}` : '/doctors';
}

function initials(name: string): string {
  return name
    .replace(/^dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
}

async function loadSpecialties(): Promise<SpecialtySummary[]> {
  try {
    const stats = await publicApiFetch<{ specialties: SpecialtySummary[] }>(
      '/api/stats',
      60,
    );
    return stats.specialties;
  } catch {
    return [];
  }
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; specialty?: string; page?: string }>;
}) {
  const params = await searchParams;
  const state: SearchState = {
    search: params.search ?? '',
    specialty: params.specialty ?? '',
  };

  const parsedPage = Number.parseInt(params.page ?? '1', 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const query = new URLSearchParams({ page: String(page) });
  if (state.search) query.set('search', state.search);
  if (state.specialty) query.set('specialty', state.specialty);

  const [result, specialties] = await Promise.all([
    publicApiFetch<Paginated<DoctorListItem>>(
      `/api/doctors?${query.toString()}`,
      30,
    ),
    loadSpecialties(),
  ]);

  return (
    <Container className="py-14">
      <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
        Find a doctor
      </h1>
      <p className="mt-2 text-ink-muted">
        {result.total} {result.total === 1 ? 'doctor' : 'doctors'} found
      </p>

      <form action="/doctors" method="GET" className="mt-6 flex gap-2">
        {state.specialty && (
          <input type="hidden" name="specialty" value={state.specialty} />
        )}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            key={state.search}
            type="text"
            name="search"
            defaultValue={state.search}
            aria-label="Search doctors"
            placeholder="Search by name, specialty, or clinic"
            className="w-full rounded-md border border-border bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded-sm bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-[0.97]"
        >
          Search
        </button>
      </form>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
        <Link
          href={buildHref({ search: state.search, specialty: '' })}
          className={`${CHIP_BASE} ${state.specialty ? CHIP_IDLE : CHIP_ACTIVE}`}
        >
          All
        </Link>
        {specialties.map(item => (
          <Link
            key={item.name}
            href={buildHref({ search: state.search, specialty: item.name })}
            className={`${CHIP_BASE} ${state.specialty === item.name ? CHIP_ACTIVE : CHIP_IDLE}`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-3">
        {result.data.map(doctor => (
          <Link
            key={doctor.id}
            href={`/doctors/${doctor.id}`}
            className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-tint text-sm font-semibold text-primary-hover">
                {initials(doctor.name)}
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-ink">
                  {doctor.name}
                </h3>
                <p className="text-sm text-ink-muted">{doctor.specialty}</p>
                <p className="mt-0.5 truncate text-sm text-ink-muted">
                  {doctor.clinic.name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-8 border-t border-border pt-4 sm:border-0 sm:pt-0 sm:text-right">
              <div>
                <p className="text-xs text-ink-muted">Next available</p>
                {doctor.nextAvailableSlot ? (
                  <p className="mt-0.5 font-mono text-sm font-medium text-primary-hover">
                    {formatNextAvailable(doctor.nextAvailableSlot)}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-ink-muted">
                    No openings soon
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-medium text-ink">
                  ${doctor.consultationFee}
                </span>
                <ArrowRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {result.data.length === 0 && (
        <div className="mt-8 rounded-lg border border-dashed border-border py-16 text-center">
          <p className="text-ink">No doctors match your search.</p>
          <Link
            href="/doctors"
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            Clear filters
          </Link>
        </div>
      )}

      {result.totalPages > 1 && (
        <nav
          className="mt-10 flex items-center justify-between"
          aria-label="Pagination"
        >
          {result.page > 1 ? (
            <Link
              href={buildHref(state, result.page - 1)}
              className={PAGE_LINK}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Link>
          ) : (
            <span />
          )}

          <span className="font-mono text-sm text-ink-muted">
            Page {result.page} of {result.totalPages}
          </span>

          {result.page < result.totalPages ? (
            <Link
              href={buildHref(state, result.page + 1)}
              className={PAGE_LINK}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </Container>
  );
}
