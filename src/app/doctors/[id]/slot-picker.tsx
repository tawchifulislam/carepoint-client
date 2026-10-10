'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { signInHref } from '@/lib/auth-redirect';
import { formatDayLabel, formatSlotTime } from '@/lib/format';
import { useMe } from '@/lib/use-me';
import { SlotConfirmPanel } from '@/components/slot-confirm-panel';
import { SlotSelector, type SlotSelection } from '@/components/slot-selector';

export function SlotPicker({
  doctorId,
  consultationFee,
}: {
  doctorId: string;
  consultationFee: number;
}) {
  const { me, loading: authLoading } = useMe();
  const router = useRouter();

  const [selection, setSelection] = useState<SlotSelection | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmBooking() {
    if (!selection || authLoading) return;

    setError(null);

    if (!me) {
      router.push(
        signInHref(`${window.location.pathname}${window.location.search}`),
      );
      return;
    }

    setConfirming(true);

    try {
      const response = await apiFetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ doctorId, slotStart: selection.slot.start }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(
          typeof data.error === 'string'
            ? data.error
            : 'This slot is no longer available.',
        );
        setSelection(null);
        setRefreshKey(key => key + 1);
        setConfirming(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError('Something went wrong. Please try again.');
      setConfirming(false);
    }
  }

  const rows = selection
    ? [
        { label: 'Date', value: formatDayLabel(selection.dateKey) },
        {
          label: 'Time',
          value: formatSlotTime(selection.slot.start),
          mono: true,
        },
        { label: 'Price', value: `$${consultationFee}`, mono: true },
      ]
    : [];

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_320px]">
      <div>
        <SlotSelector
          doctorId={doctorId}
          selectedStart={selection?.slot.start ?? null}
          refreshKey={refreshKey}
          onSelect={value => {
            setSelection(value);
            if (value) setError(null);
          }}
        />

        {error && (
          <p role="alert" className="mt-4 text-sm text-red">
            {error}
          </p>
        )}
      </div>

      <SlotConfirmPanel
        heading="Your appointment"
        sheetHeading="Confirm your appointment"
        emptyText="Select a time to continue."
        barLabel={selection ? formatSlotTime(selection.slot.start) : null}
        barAction="Review & Pay"
        rows={rows}
        confirmLabel="Confirm & Pay"
        confirmingLabel="Processing..."
        confirming={confirming}
        onConfirm={confirmBooking}
      />
    </div>
  );
}
