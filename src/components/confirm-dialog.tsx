'use client';

import { TriangleAlert } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  loading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      cancelRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !loading) {
        onClose();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close dialog"
        disabled={loading}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-ink/50 backdrop-blur-[2px] animate-in fade-in-0 duration-200"
      />
      <div className="relative w-full max-w-md rounded-t-xl bg-surface p-6 pb-[calc(env(safe-area-inset-bottom,0px)+24px)] shadow-lift animate-in fade-in-0 slide-in-from-bottom-4 duration-200 sm:mx-4 sm:rounded-xl sm:pb-6 sm:zoom-in-95 sm:slide-in-from-bottom-0">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-tint text-red">
          <TriangleAlert className="h-5 w-5" />
        </span>
        <h2
          id="confirm-dialog-title"
          className="mt-4 text-lg font-semibold text-ink"
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            ref={cancelRef}
            onClick={onClose}
            disabled={loading}
            className="rounded-sm border border-border px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-paper disabled:opacity-50 sm:py-2.5"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-sm bg-red px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_18px_-8px_rgb(180_71_46/0.6)] transition hover:opacity-90 disabled:opacity-50 sm:py-2.5"
          >
            {loading ? 'Please wait...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
