'use client';

import { useEffect, useRef, useState } from 'react';

export function CountUp({
  value,
  durationMs = 1400,
}: {
  value: number;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    let frame = 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();

      const start = performance.now();

      function tick(now: number) {
        const progress = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.floor(eased * value));
        if (progress < 1) frame = requestAnimationFrame(tick);
      }

      frame = requestAnimationFrame(tick);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, durationMs]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {display.toLocaleString('en-US')}
      </span>
      <span className="sr-only">{value.toLocaleString('en-US')}</span>
    </>
  );
}
