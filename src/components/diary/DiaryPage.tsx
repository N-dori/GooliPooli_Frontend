'use client';

import type { VisitWithDetails } from '@/lib/types';
import { useVisitsByMonth } from '@/lib/hooks/useVisits';
import { useAuthStore } from '@/lib/stores/authStore';
import { DayVisitList } from './DayVisitList';

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function DiaryPage() {
  const user = useAuthStore((s) => s.user);

  // Always show today — use month hook (data logic unchanged)
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const { data, isLoading, error } = useVisitsByMonth(year, month);

  // Role-filtered visits for the whole month
  const allVisits: VisitWithDetails[] = data?.items ?? [];
  const visibleVisits = user?.role === 'worker' ? allVisits.filter((v) => v.workerId === user.id) : allVisits;

  // Filter to today
  const todayStr = toDateStr(today);
  const dayVisits = visibleVisits?.filter(
    (v) => v.scheduledDate.slice(0, 10) === todayStr,
  );

  if (error) {
    return (
      <p className="rounded-xl border border-dashed py-10 text-center text-sm text-muted-foreground">
        {(error as Error).message ?? 'Failed to load visits'}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="space-y-4">
          <div className="h-16 animate-pulse rounded-xl bg-muted/40" />
          <div className="h-2 animate-pulse rounded-full bg-muted/40" />
          <div className="h-10 animate-pulse rounded-full bg-muted/30 w-36" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted/40" />
          ))}
        </div>
      ) : (
        <DayVisitList visits={dayVisits} date={today} />
      )}
    </div>
  );
}
