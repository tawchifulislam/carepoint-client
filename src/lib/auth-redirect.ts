export const OAUTH_NEXT_KEY = 'oauth_next';

const AUTH_PATH = /^\/(sign-in|sign-up)(\/|\?|$)/;

function hasControlCharacters(value: string): boolean {
  for (const char of value) {
    const code = char.charCodeAt(0);

    if (code < 32 || code === 127) {
      return true;
    }
  }

  return false;
}

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw) return '/';

  const isLocalPath =
    raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\');

  if (!isLocalPath || hasControlCharacters(raw) || AUTH_PATH.test(raw)) {
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
