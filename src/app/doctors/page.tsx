import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Search,
  SearchX,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import { Container } from '@/components/container';
import { PageHeader } from '@/components/page-header';
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
  'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition';
const CHIP_ACTIVE =
  'border-primary bg-primary text-white shadow-[0_6px_14px_-6px_rgb(10_112_136/0.6)]';
const CHIP_IDLE =
  'border-border bg-surface text-ink hover:border-primary/50 hover:text-primary-hover';
const PAGE_LINK =
  'inline-flex items-center gap-1.5 rounded-sm border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink shadow-[0_1px_2px_rgb(10_26_37/0.04)] transition hover:border-primary/50 hover:text-primary-hover';

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
    <>
      <section className="relative overflow-hidden border-b border-border bg-surface/60">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_100%_at_85%_0%,#000_20%,transparent_70%)]"
        />
        <Container className="relative py-10 md:py-14">
          <PageHeader
            eyebrow="FIND A DOCTOR"
            title="Find a doctor"
            description={`${result.total} ${result.total === 1 ? 'doctor' : 'doctors'} found`}
          />

          <form
            action="/doctors"
            method="GET"
            className="mt-7 flex max-w-2xl flex-col gap-2 sm:flex-row"
          >
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
                className="w-full rounded-md border border-border bg-surface py-3.5 pl-11 pr-4 text-base text-ink shadow-card transition placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="rounded-sm bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgb(10_112_136/0.65)] transition hover:-translate-y-px hover:bg-primary-hover active:scale-[0.97] sm:py-0"
            >
              Search
            </button>
          </form>

          <div className="-mx-6 mt-5 flex gap-2 overflow-x-auto px-6 pb-1 scrollbar-none [&::-webkit-scrollbar]:hidden">
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
        </Container>
      </section>

      <Container className="py-10 md:py-12">
        <div className="grid gap-4 lg:grid-cols-2">
          {result.data.map(doctor => (
            <Link
              key={doctor.id}
              href={`/doctors/${doctor.id}`}
              className="group flex min-w-0 flex-col rounded-xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift sm:p-6"
            >
              <div className="flex items-start gap-4">
                <Avatar name={doctor.name} className="h-14 w-14 text-base" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-ink">
                    {doctor.name}
                  </h3>
                  <p className="mt-1 inline-flex max-w-full rounded-full bg-primary-tint px-2.5 py-0.5 text-xs font-semibold text-primary-hover">
                    <span className="truncate">{doctor.specialty}</span>
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{doctor.clinic.name}</span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-mono text-lg font-semibold text-ink">
                    ${doctor.consultationFee}
                  </p>
                  <p className="text-[11px] text-ink-muted">consultation</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <div className="min-w-0">
                  <p className="text-xs text-ink-muted">Next available</p>
                  {doctor.nextAvailableSlot ? (
                    <p className="mt-0.5 inline-flex items-center gap-1.5 truncate font-mono text-sm font-medium text-primary-hover">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                      {formatNextAvailable(doctor.nextAvailableSlot)}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-sm text-ink-muted">
                      No openings soon
                    </p>
                  )}
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-primary-tint px-4 py-2 text-xs font-semibold text-primary-hover transition-colors group-hover:bg-primary group-hover:text-white">
                  View slots
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {result.data.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint text-primary">
              <SearchX className="h-6 w-6" />
            </span>
            <p className="mt-4 font-semibold text-ink">
              No doctors match your search.
            </p>
            <Link
              href="/doctors"
              className="mt-2 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Clear filters
            </Link>
          </div>
        )}

        {result.totalPages > 1 && (
          <nav
            className="mt-10 flex items-center justify-between gap-3"
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
    </>
  );
}
