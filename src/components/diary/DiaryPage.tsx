'use client';

import type { VisitWithDetails } from '@/lib/types';
import { useState } from 'react';
import { useVisitsByMonth } from '@/lib/hooks/useVisits';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';
import { DayVisitList } from './DayVisitList';
import { MonthCalendar } from './MonthCalendar';

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function DiaryPage() {
  const { t } = useLocale();
  const user = useAuthStore((s) => s.user);
  const today = new Date();

  const [calendarDate, setCalendarDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(today);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth() + 1;

  const { data, isLoading } = useVisitsByMonth(year, month);

  // Role-filtered visits
  const allVisits: VisitWithDetails[] = data?.items ?? [];
  const visibleVisits =
    user?.role === 'worker'
      ? allVisits.filter((v) => v.workerId === user.id)
      : allVisits;

  // Visits for the selected day
  const selectedDateStr = toDateStr(selectedDay);
  const dayVisits = visibleVisits.filter(
    (v) => v.scheduledDate.slice(0, 10) === selectedDateStr,
  );

  const handlePrevMonth = () => {
    setCalendarDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t('diary.title')}</h1>

      {isLoading ? (
        <div className="h-48 rounded-xl bg-muted/40 animate-pulse" />
      ) : (
        <MonthCalendar
          year={year}
          month={month}
          selectedDay={selectedDay}
          visits={visibleVisits}
          onDaySelect={setSelectedDay}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      )}

      <DayVisitList visits={dayVisits} date={selectedDay} />
    </div>
  );
}
