'use client';

import type { VisitStatus, VisitWithDetails } from '@/lib/types';
import { Check, MapPin, Navigation, Phone } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ReportSheet } from './ReportSheet';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { cn } from '@/lib/utils';

// ─── Avatar palette ──────────────────────────────────────────────────────────
const AVATAR_PALETTE = [
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
  { bg: 'bg-pink-100', text: 'text-pink-700' },
  { bg: 'bg-amber-100', text: 'text-amber-700' },
  { bg: 'bg-teal-100', text: 'text-teal-700' },
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  { bg: 'bg-lime-100', text: 'text-lime-700' },
] as const;

function getAvatarStyle(name: string) {
  const idx = (name.charCodeAt(0) || 0) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[idx];
}

function formatTime(isoStr: string) {
  try {
    return new Date(isoStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  visit: VisitWithDetails;
}

export function DiaryClientCard({ visit }: Props) {
  const { t } = useLocale();
  const client = visit.client;

  // Local status for optimistic update + report-sheet visibility
  const [localStatus, setLocalStatus] = useState<VisitStatus>(visit.status);
  const [localCompletedAt, setLocalCompletedAt] = useState<string | null>(
    visit.completedAt ?? null,
  );
  const [reportOpen, setReportOpen] = useState(false);

  // Sync with server state when query re-fetches
  useEffect(() => {
    setLocalStatus(visit.status);
    setLocalCompletedAt(visit.completedAt ?? null);
  }, [visit.status, visit.completedAt]);

  if (!client) return null;

  const isCompleted = localStatus === 'completed';
  const avatarStyle = getAvatarStyle(client.name);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`;

  const handleCheckClick = () => {
    if (isCompleted) return; // already done — no-op
    setReportOpen(true);
  };

  // Called after the ReportSheet successfully saves notes + marks complete.
  // We flip local state immediately for a snappy UI; the React Query
  // invalidation will reconcile shortly.
  const handleCompleted = () => {
    setLocalStatus('completed');
    setLocalCompletedAt(new Date().toISOString());
  };

  return (
    <div
      className={cn(
        'flex flex-row items-start gap-3 rounded-2xl p-4 transition-colors rtl:flex-row-reverse',
        isCompleted
          ? 'border border-green-100 bg-green-50'
          : 'bg-white shadow-sm dark:bg-card dark:shadow-none dark:border dark:border-border',
      )}
    >
      {/* ── Tap area: avatar + client info → client detail ───────────── */}
      <Link
        href={`/clients/${client.id}`}
        className="flex min-w-0 flex-1 items-start gap-3 rtl:flex-row-reverse"
      >
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-semibold',
            isCompleted
              ? 'bg-green-200 text-green-800'
              : `${avatarStyle.bg} ${avatarStyle.text}`,
          )}
        >
          {client.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p
            className={cn(
              'truncate text-base font-semibold',
              isCompleted ? 'text-green-800' : 'text-foreground',
            )}
          >
            {client.name}
          </p>

          <div
            className={cn(
              'flex items-center gap-1 text-xs',
              isCompleted ? 'text-green-700' : 'text-muted-foreground',
            )}
          >
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{client.address}</span>
          </div>

          {client.note && (
            <p
              className={cn(
                'text-xs',
                isCompleted ? 'text-green-600' : 'text-muted-foreground',
              )}
            >
              {client.note}
            </p>
          )}

          {isCompleted && localCompletedAt && (
            <p className="text-xs text-green-600">
              ⏱ {formatTime(localCompletedAt)}
            </p>
          )}
        </div>
      </Link>

      {/* ── Action buttons (stacked column on the right) ──────────────── */}
      <div className="flex shrink-0 flex-col gap-2 rtl:order-first">
        {/* Phone */}
        {client.phone ? (
          <a
            href={`tel:${client.phone}`}
            aria-label={t('diary.phone')}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500 text-white shadow-sm transition-opacity hover:opacity-85 active:opacity-75"
          >
            <Phone className="h-5 w-5" />
          </a>
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-muted dark:text-muted-foreground">
            <Phone className="h-5 w-5" />
          </span>
        )}

        {/* Navigate */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('diary.navigate')}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500 text-white shadow-sm transition-opacity hover:opacity-85 active:opacity-75"
        >
          <Navigation className="h-5 w-5" />
        </a>

        {/* Complete ✓ — opens the report sheet; turns green once completed */}
        <button
          onClick={handleCheckClick}
          disabled={isCompleted}
          aria-label={t('diary.markComplete')}
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-colors',
            isCompleted
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-muted dark:text-muted-foreground',
          )}
        >
          <Check className="h-5 w-5" />
        </button>
      </div>

      <ReportSheet
        visit={visit}
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        mode="complete"
        onCompleted={handleCompleted}
      />
    </div>
  );
}
