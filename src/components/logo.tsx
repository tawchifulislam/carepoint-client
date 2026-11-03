type LogoTone = 'dark' | 'light';

export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 rounded-[28%] bg-linear-to-br from-[#12a3b4] to-[#0a6478] shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_6px_14px_-6px_rgb(10_112_136/0.7)] ${className}`}
    >
      <svg viewBox="0 0 40 40" fill="none" className="h-full w-full">
        <title>CarePoint</title>
        <path
          d="M19 11v18M10 20h18"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="30" cy="10" r="3.6" fill="#7FF0D8" />
      </svg>
    </span>
  );
}

export function Logo({
  tone = 'dark',
  className = '',
}: {
  tone?: LogoTone;
  className?: string;
}) {
  const light = tone === 'light';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark />
      <span
        className={`font-display text-[19px] font-bold tracking-tight ${
          light ? 'text-white' : 'text-ink'
        }`}
      >
        Care
        <span className={light ? 'text-[#7FF0D8]' : 'text-primary'}>Point</span>
      </span>
    </span>
  );
}
