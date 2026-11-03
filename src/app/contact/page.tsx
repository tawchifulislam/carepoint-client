import { Mail } from 'lucide-react';
import type { Metadata } from 'next';
import { LegalPage, LegalSection } from '@/components/legal-page';
import { CONTACT_EMAIL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact | CarePoint',
  description: 'How to get in touch about CarePoint.',
};

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="CONTACT"
      title="Contact"
      intro="Have a question or some feedback about CarePoint? Here is how to reach us."
    >
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="flex items-center gap-4 rounded-xl border border-border bg-surface p-6 shadow-card transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lift"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary">
          <Mail className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-xs text-ink-muted">Email</span>
          <span className="block break-all font-mono text-sm font-semibold text-ink">
            {CONTACT_EMAIL}
          </span>
        </span>
      </a>

      <LegalSection title="About this address">
        <p>
          This is a placeholder address for a demo project, so nobody reads
          messages sent to it. It shows where contact details would go on a live
          service.
        </p>
      </LegalSection>

      <LegalSection title="Medical help">
        <p>
          CarePoint cannot give medical advice and is not for emergencies. If
          you need urgent care, contact your local emergency services.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
