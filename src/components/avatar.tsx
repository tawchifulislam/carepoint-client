const GRADIENTS = [
  'from-[#12a3b4] to-[#0a6478]',
  'from-[#2f80ed] to-[#1b4fa8]',
  'from-[#12a58f] to-[#0b7566]',
  'from-[#6d5bd0] to-[#43348f]',
];

function hashName(name: string): number {
  let hash = 0;

  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 997;
  }

  return hash;
}

export function initialsOf(name: string): string {
  return name
    .replace(/^dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  name,
  className = 'h-12 w-12 text-sm',
}: {
  name: string;
  className?: string;
}) {
  const gradient = GRADIENTS[hashName(name) % GRADIENTS.length];

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-linear-to-br font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3)] ${gradient} ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
