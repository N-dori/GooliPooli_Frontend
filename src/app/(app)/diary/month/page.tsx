'use client';

import type { VisitWithDetails } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MonthCalendar } from '@/components/diary/MonthCalendar';
import { useVisitsByMonth } from '@/lib/hooks/useVisits';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function DiaryMonthPage() {
  const { t } = useLocale();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const today = new Date();

  const [calendarDate, setCalendarDate] = useState(today);
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth() + 1;

  const { data, isLoading, error } = useVisitsByMonth(year, month);

  const allVisits: VisitWithDetails[] = data?.items ?? [];
  const visibleVisits =
    user?.role === 'worker'
      ? allVisits.filter((v) => v.workerId === user.id)
      : allVisits;

  const handleDaySelect = (date: Date) => {
    // Navigate to diary page. Since DiaryPage shows today, we pass the date
    // via a query param so the diary can show that day (future enhancement).
    // For now, just navigate to /diary.
    router.push(`/diary?date=${toDateStr(date)}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t('nav.month')}</h1>

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-xl bg-muted/40" />
      ) : error ? (
        <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
          {(error as Error).message ?? 'Failed to load visits'}
        </p>
      ) : (
        <MonthCalendar
          year={year}
          month={month}
          selectedDay={today}
          visits={visibleVisits}
          onDaySelect={handleDaySelect}
          onPrevMonth={() =>
            setCalendarDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
          }
          onNextMonth={() =>
            setCalendarDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
          }
        />
      )}

      <p className="text-center text-xs text-muted-foreground">
        Tap a day to view its visits
      </p>
    </div>
  );
}
