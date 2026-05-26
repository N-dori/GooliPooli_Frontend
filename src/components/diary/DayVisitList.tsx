'use client';

import type { VisitWithDetails } from '@/lib/types';
import { Navigation } from 'lucide-react';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { DiaryClientCard } from './ClientCard';

interface Props {
  visits: VisitWithDetails[];
  date: Date;
  projectName?: string;
}

export function DayVisitList({ visits, date, projectName }: Props) {
  const { t, locale } = useLocale();

  // ── Date parts ────────────────────────────────────────────────────────────
  const localeStr = locale === 'he' ? 'he-IL' : 'en-US';
  const dayOfWeek = date.toLocaleDateString(localeStr, { weekday: 'long' });
  const dayNumber = date.getDate();
  const monthName = date.toLocaleDateString(localeStr, { month: 'long' });

  // ── Progress ──────────────────────────────────────────────────────────────
  const total = visits.length;
  const completed = visits.filter((v) => v.status === 'completed').length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  // ── Optimize route (Google Maps waypoints) ─────────────────────────────────
  const handleOptimize = () => {
    const addresses = visits
      .filter((v) => v.client?.address)
      .map((v) => encodeURIComponent(v.client!.address));
    if (addresses.length === 0) return;
    // Build a Google Maps URL with all addresses as waypoints
    const destination = addresses[addresses.length - 1];
    const waypoints = addresses.slice(0, -1).join('|');
    const url = waypoints
      ? `https://www.google.com/maps/dir/?api=1&destination=${destination}&waypoints=${waypoints}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-4">
      {/* ── Project / route label ──────────────────────────────────────── */}
      {projectName && (
        <p className="text-sm text-muted-foreground">{projectName}</p>
      )}

      {/* ── Date header row ────────────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-2 rtl:flex-row-reverse">
        {/* Left: day-of-week + date number + month */}
        <div>
          <p className="text-xs text-muted-foreground">{dayOfWeek}</p>
          <div className="flex items-baseline gap-2 rtl:flex-row-reverse">
            <span className="text-4xl font-bold leading-none">{dayNumber}</span>
            <span className="text-4xl font-light leading-none">{monthName}</span>
          </div>
        </div>

        {/* Right: progress badge */}
        {total > 0 && (
          <div className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
            {completed}/{total} ✓
          </div>
        )}
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────── */}
      {total > 0 && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-muted">
          <div
            className="h-full rounded-full bg-blue-500 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* ── Optimize route button ─────────────────────────────────────── */}
      {visits.length > 0 && (
        <button
          onClick={handleOptimize}
          className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:border-border"
        >
          <Navigation className="h-4 w-4" />
          {t('diary.optimizeRoute')}
        </button>
      )}

      {/* ── Visit cards ───────────────────────────────────────────────── */}
      {visits.length === 0 ? (
        <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
          {t('diary.noClients')}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visits.map((v) => (
            <li key={v.id}>
              <DiaryClientCard visit={v} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
