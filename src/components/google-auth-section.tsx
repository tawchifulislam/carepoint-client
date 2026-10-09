import { GoogleSignInButton } from './google-sign-in-button';

export function GoogleAuthSection({ next }: { next: string }) {
  if (process.env.NEXT_PUBLIC_GOOGLE_AUTH !== 'true') {
    return null;
  }

  return (
    <div>
      <GoogleSignInButton next={next} />
      <div
        className="my-6 flex items-center gap-4 text-xs text-ink-muted"
        aria-hidden="true"
      >
        <span className="h-px flex-1 bg-border" />
        or
        <span className="h-px flex-1 bg-border" />
      </div>
    </div>
  );
}
