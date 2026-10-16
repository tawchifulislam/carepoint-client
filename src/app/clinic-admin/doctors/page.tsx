'use client';

import { ReviewQueue } from '@/components/review-queue';
import { formatMoney } from '@/lib/money';
import type { ReviewDoctor } from '@/types/admin';

export default function ClinicDoctorsPage() {
  return (
    <ReviewQueue<ReviewDoctor>
      noun="doctor"
      toRow={doctor => ({
        title: doctor.user.name,
        subtitle: doctor.specialty,
        detail: `${doctor.user.email} \u00b7 ${formatMoney(doctor.consultationFee)} consultation`,
      })}
      revokeWarning="They disappear from search and lose portal access right away. This is blocked while they still have booked appointments."
    />
  );
}
