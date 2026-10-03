import Link from 'next/link';
import { Container } from './container';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="flex h-16 items-center justify-between text-sm text-ink-muted">
        <span>&copy; {new Date().getFullYear()} CarePoint</span>
        <div className="flex gap-6">
          <Link href="/about" className="hover:text-ink">
            About
          </Link>
          <Link href="/contact" className="hover:text-ink">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
        </div>
      </Container>
    </footer>
  );
}
