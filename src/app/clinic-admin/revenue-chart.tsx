'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { addDaysToKey } from '@/lib/date-keys';
import { dhakaDateKey, formatDayLabel } from '@/lib/format';
import { formatMoney } from '@/lib/money';
import type { DashboardPoint, DashboardRange } from '@/types/admin';

const COLORS = { primary: '#0C7489', border: '#E2E8EB', muted: '#5E6F7A' };
const RANGE_LENGTH: Record<Exclude<DashboardRange, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
};

const tickDate = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

function fillSeries(
  series: DashboardPoint[],
  range: DashboardRange,
): DashboardPoint[] {
  if (range === 'all') {
    return series;
  }

  const byDate = new Map(series.map(point => [point.date, point]));
  const today = dhakaDateKey(new Date());
  const filled: DashboardPoint[] = [];

  for (let offset = RANGE_LENGTH[range] - 1; offset >= 0; offset--) {
    const key = addDaysToKey(today, -offset);
    filled.push(byDate.get(key) ?? { date: key, revenue: 0, bookings: 0 });
  }

  return filled;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: DashboardPoint }[];
}) {
  const point = payload?.[0]?.payload;

  if (!active || !point) {
    return null;
  }

  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-card">
      <p className="font-semibold text-ink">{formatDayLabel(point.date)}</p>
      <p className="mt-1 font-mono text-ink-muted">
        {formatMoney(point.revenue)} &middot; {point.bookings}{' '}
        {point.bookings === 1 ? 'booking' : 'bookings'}
      </p>
    </div>
  );
}

export function RevenueChart({
  series,
  range,
}: {
  series: DashboardPoint[];
  range: DashboardRange;
}) {
  const data = fillSeries(series, range);

  if (!data.some(point => point.revenue > 0)) {
    return (
      <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-sm text-ink-muted">
        No revenue in this period.
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.25} />
              <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={COLORS.border} />
          <XAxis
            dataKey="date"
            tickFormatter={(value: string) =>
              tickDate.format(new Date(`${value}T00:00:00Z`))
            }
            tickLine={false}
            axisLine={false}
            minTickGap={28}
            tick={{ fontSize: 12, fill: COLORS.muted }}
          />
          <YAxis
            tickFormatter={(value: number) => `$${value}`}
            tickLine={false}
            axisLine={false}
            width={52}
            tick={{ fontSize: 12, fill: COLORS.muted }}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={COLORS.primary}
            strokeWidth={2}
            fill="url(#revenueFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
