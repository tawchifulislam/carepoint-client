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
      <ul className="flex min-w-max gap-1 border-b border-border">
        {tabs.map(tab => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px inline-block border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  active
                    ? 'border-primary text-primary'
                    : 'border-transparent text-ink-muted hover:text-ink'
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
