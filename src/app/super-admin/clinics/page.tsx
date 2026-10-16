'use client';

import { ReviewQueue } from '@/components/review-queue';
import type { ReviewClinic } from '@/types/admin';

export default function SuperAdminClinicsPage() {
  return (
    <ReviewQueue<ReviewClinic>
      noun="clinic"
      toRow={clinic => ({
        title: clinic.name,
        subtitle: clinic.address,
        detail: `Admin: ${clinic.adminUser.name} (${clinic.adminUser.email}) \u00b7 ${clinic.doctorCount} ${
          clinic.doctorCount === 1 ? 'doctor' : 'doctors'
        }`,
      })}
      revokeWarning="The clinic and all of its doctors disappear from search right away. This is blocked while any of its doctors still have booked appointments."
    />
  );
}
