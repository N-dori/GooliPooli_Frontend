'use client';

import type { VisitWithDetails } from '@/lib/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  year: number;
  month: number; // 1-indexed
  selectedDay: Date;
  visits: VisitWithDetails[];
  onDaySelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const WEEKDAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function MonthCalendar({
  year,
  month,
  selectedDay,
  visits,
  onDaySelect,
  onPrevMonth,
  onNextMonth,
}: Props) {
  const today = new Date();
  const firstDay = new Date(year, month - 1, 1);
  const startPad = firstDay.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month, 0).getDate();

  // Build a set of date strings that have visits
  const datesWithVisits = new Set<string>();
  visits.forEach((v) => {
    datesWithVisits.add(v.scheduledDate.slice(0, 10));
  });

  const monthLabel = new Date(year, month - 1, 1).toLocaleString('en', {
    month: 'long',
    year: 'numeric',
  });

  // Build grid cells: padded start + days of month
  const totalCells = Math.ceil((startPad + daysInMonth) / 7) * 7;
  const cells: Array<number | null> = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < totalCells) cells.push(null);

  return (
    <div className="rounded-xl border bg-card p-3 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={onPrevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <button
          onClick={onNextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>

      {/* Weekday labels */}
      <div className="mb-1 grid grid-cols-7 text-center">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d} className="text-xs font-medium text-muted-foreground">
            {d}
          </span>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, idx) => {
          if (day === null) return <div key={`pad-${idx}`} />;

          const dateStr = toDateStr(year, month, day);
          const cellDate = new Date(year, month - 1, day);
          const isToday = isSameDay(cellDate, today);
          const isSelected = isSameDay(cellDate, selectedDay);
          const hasVisit = datesWithVisits.has(dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => onDaySelect(cellDate)}
              className={cn(
                'flex flex-col items-center justify-center rounded-full py-1 text-sm transition-colors',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : isToday
                    ? 'bg-accent text-accent-foreground font-semibold'
                    : hasVisit
                      ? 'text-foreground hover:bg-accent/50'
                      : 'text-muted-foreground/60 hover:bg-accent/30',
              )}
            >
              <span>{day}</span>
              {hasVisit && !isSelected && (
                <span
                  className={cn(
                    'mt-0.5 h-1 w-1 rounded-full',
                    isToday ? 'bg-primary' : 'bg-primary/70',
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
