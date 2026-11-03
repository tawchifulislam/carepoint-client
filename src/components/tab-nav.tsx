'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface TabItem {
  href: string;
  label: string;
  exact?: boolean;
}

export function TabNav({ label, tabs }: { label: string; tabs: TabItem[] }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className="-mx-6 overflow-x-auto px-6 scrollbar-none [&::-webkit-scrollbar]:hidden"
    >
      <ul className="inline-flex min-w-max gap-1 rounded-lg border border-border bg-surface p-1 shadow-card">
        {tabs.map(tab => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`inline-block rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-primary-tint text-primary-hover'
                    : 'text-ink-muted hover:bg-paper hover:text-ink'
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
