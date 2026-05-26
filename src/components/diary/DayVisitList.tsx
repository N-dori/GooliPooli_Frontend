'use client';

import type { VisitWithDetails } from '@/lib/types';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { DiaryClientCard } from './ClientCard';

interface Props {
  visits: VisitWithDetails[];
  date: Date;
}

export function DayVisitList({ visits, date }: Props) {
  const { t } = useLocale();

  const dateLabel = date.toLocaleDateString('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-muted-foreground">{dateLabel}</h2>
      {visits.length === 0 ? (
        <p className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
          {t('diary.noClients')}
        </p>
      ) : (
        <ul className="space-y-2">
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
