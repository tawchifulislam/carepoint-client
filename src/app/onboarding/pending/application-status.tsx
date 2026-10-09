'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CircleCheck, Clock, XCircle } from 'lucide-react';
import { StateCard } from '@/components/state-card';
import { PRIMARY_BUTTON, SECONDARY_LINK } from '@/lib/button-styles';
import { useMe } from '@/lib/use-me';

type ApplicationKind = 'clinic' | 'doctor';
type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface StatusCopy {
  title: string;
  body: string;
  href?: string;
  cta?: string;
}

const COPY: Record<ApplicationKind, Record<ApprovalStatus, StatusCopy>> = {
  clinic: {
    PENDING: {
      title: 'Your clinic is under review',
      body: 'The CarePoint team is reviewing your registration. Your clinic goes live, and you can start adding doctors, once it is approved.',
    },
    APPROVED: {
      title: 'Your clinic is approved',
      body: 'You can now manage doctors and follow bookings from your clinic dashboard.',
      href: '/clinic-admin',
      cta: 'Open clinic dashboard',
    },
    REJECTED: {
      title: 'Your registration was not approved',
      body: 'This clinic could not be approved. This account cannot submit another registration yet.',
    },
  },
  doctor: {
    PENDING: {
      title: 'Your application is under review',
      body: 'Your clinic administrator will review your application. You can set your availability once it is approved.',
    },
    APPROVED: {
      title: 'You are approved',
      body: 'Set your weekly availability so patients can start booking.',
      href: '/doctor-portal/availability',
      cta: 'Set up availability',
    },
    REJECTED: {
      title: 'Your application was not approved',
      body: 'Your clinic did not approve this application. This account cannot submit another one yet.',
    },
  },
};

const PRESENTATION = {
  PENDING: { icon: Clock, tone: 'amber' },
  APPROVED: { icon: CircleCheck, tone: 'primary' },
  REJECTED: { icon: XCircle, tone: 'red' },
} as const;

function toStatus(value: string): ApprovalStatus {
  return value === 'APPROVED' || value === 'REJECTED' ? value : 'PENDING';
}

export function ApplicationStatus() {
  const { me, refresh } = useMe();
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    }

    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [refresh]);

  async function check() {
    setChecking(true);
    await refresh();
    setChecking(false);
  }

  if (!me) {
    return null;
  }

  const application = me.adminOfClinic
    ? {
        kind: 'clinic' as const,
        status: toStatus(me.adminOfClinic.approvalStatus),
      }
    : me.doctor
      ? { kind: 'doctor' as const, status: toStatus(me.doctor.approvalStatus) }
      : null;

  if (!application) {
    return (
      <StateCard icon={Clock} tone="amber" title="No application yet">
        <p>
          You have not submitted a clinic registration or a doctor application.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/onboarding/clinic" className={PRIMARY_BUTTON}>
            Register a clinic
          </Link>
          <Link href="/onboarding/doctor" className={SECONDARY_LINK}>
            Apply as a doctor
          </Link>
        </div>
      </StateCard>
    );
  }

  const copy = COPY[application.kind][application.status];
  const presentation = PRESENTATION[application.status];

  return (
    <StateCard
      icon={presentation.icon}
      tone={presentation.tone}
      title={copy.title}
    >
      <p>{copy.body}</p>

      {application.status === 'PENDING' && (
        <p>
          We do not send email updates yet, so check back here. This page also
          refreshes when you return to the tab.
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {application.status === 'PENDING' && (
          <button
            onClick={check}
            disabled={checking}
            className={PRIMARY_BUTTON}
          >
            {checking ? 'Checking...' : 'Check status'}
          </button>
        )}

        {copy.href && copy.cta && (
          <Link href={copy.href} className={PRIMARY_BUTTON}>
            {copy.cta}
          </Link>
        )}

        <Link href="/" className={SECONDARY_LINK}>
          Back to home
        </Link>
      </div>
    </StateCard>
  );
}
