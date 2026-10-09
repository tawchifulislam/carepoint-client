const AUTH_PATH = /^\/(sign-in|sign-up)(\/|\?|$)/;
const CONTROL_CHARS = /[\u0000-\u001f]/;

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return '/';

  const isLocalPath =
    raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\');

  if (!isLocalPath || CONTROL_CHARS.test(raw) || AUTH_PATH.test(raw)) {
    return '/';
  }

  return raw;
}

export function signInHref(next: string): string {
  const safe = safeNextPath(next);
  return safe === '/'
    ? '/sign-in'
    : `/sign-in?next=${encodeURIComponent(safe)}`;
}

export function signUpHref(next: string): string {
  const safe = safeNextPath(next);
  return safe === '/'
    ? '/sign-up'
    : `/sign-up?next=${encodeURIComponent(safe)}`;
}
