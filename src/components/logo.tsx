export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <svg
        width="26"
        height="26"
        viewBox="0 0 40 40"
        fill="none"
        className="shrink-0"
      >
        <path
          d="M30 11.6A13 13 0 1 1 10 11.6"
          stroke="#0C7489"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="7" r="2.6" fill="#0C7489" />
      </svg>
      <span className="font-display text-xl font-bold tracking-tight text-ink">
        CarePoint
      </span>
    </span>
  );
}
