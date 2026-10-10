'use client';

import { useEffect, useState } from 'react';
import { PRIMARY_BUTTON } from '@/lib/button-styles';

export interface SummaryRow {
  label: string;
  value: string;
  mono?: boolean;
}

interface SlotConfirmPanelProps {
  heading: string;
  sheetHeading: string;
  emptyText: string;
  barLabel: string | null;
  barAction: string;
  rows: SummaryRow[];
  note?: string;
  confirmLabel: string;
  confirmingLabel: string;
  confirming: boolean;
  onConfirm: () => void;
}

function Rows({ rows }: { rows: SummaryRow[] }) {
  return (
    <dl className="space-y-2 text-sm">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex justify-between gap-4 ${index < rows.length - 1 ? 'border-b border-border pb-2' : ''}`}
        >
          <dt className="shrink-0 text-ink-muted">{row.label}</dt>
          <dd
            className={`text-right font-medium text-ink ${row.mono ? 'font-mono' : ''}`}
          >
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function SlotConfirmPanel({
  heading,
  sheetHeading,
  emptyText,
  barLabel,
  barAction,
  rows,
  note,
  confirmLabel,
  confirmingLabel,
  confirming,
  onConfirm,
}: SlotConfirmPanelProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const hasSelection = barLabel !== null;

  useEffect(() => {
    if (!hasSelection) setSheetOpen(false);
  }, [hasSelection]);

  useEffect(() => {
    if (!sheetOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setSheetOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sheetOpen]);

  const confirmButton = (
    <button
      onClick={onConfirm}
      disabled={confirming}
      className={`${PRIMARY_BUTTON} mt-4 w-full`}
    >
      {confirming ? confirmingLabel : confirmLabel}
    </button>
  );

  return (
    <>
      <div className="sticky top-24 hidden h-fit rounded-lg border border-border bg-surface p-6 md:block">
        <h3 className="text-sm font-semibold text-ink">{heading}</h3>

        {!hasSelection ? (
          <p className="mt-3 text-sm text-ink-muted">{emptyText}</p>
        ) : (
          <div className="mt-4">
            <Rows rows={rows} />
            {note && <p className="mt-4 text-xs text-ink-muted">{note}</p>}
            {confirmButton}
          </div>
        )}
      </div>

      {hasSelection && (
        <button
          onClick={() => setSheetOpen(true)}
          className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-lg bg-primary px-5 py-3.5 text-white shadow-card md:hidden"
        >
          <span className="text-sm">
            Selected &middot;{' '}
            <span className="font-mono font-semibold">{barLabel}</span>
          </span>
          <span className="rounded-sm bg-white/20 px-3 py-1.5 text-xs font-semibold">
            {barAction}
          </span>
        </button>
      )}

      {sheetOpen && hasSelection && (
        <>
          <div
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 z-40 bg-ink/40 md:hidden"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={sheetHeading}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-xl bg-surface p-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] md:hidden"
          >
            <div className="mx-auto mb-4 h-1 w-9 rounded-full bg-border" />
            <h3 className="text-base font-semibold text-ink">{sheetHeading}</h3>
            <div className="mt-4">
              <Rows rows={rows} />
            </div>
            {note && <p className="mt-4 text-xs text-ink-muted">{note}</p>}
            {confirmButton}
          </div>
        </>
      )}
    </>
  );
}
