'use client';

import type { VisitWithDetails } from '@/lib/types';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useUpdateVisit } from '@/lib/hooks/useVisits';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

interface Props {
  visit: VisitWithDetails;
  open: boolean;
  onClose: () => void;
  /**
   * 'edit'     — save notes only (default; for the 📋 report icon)
   * 'complete' — save notes AND flip the visit to status='completed'
   */
  mode?: 'edit' | 'complete';
  /** Fired after a successful complete-mode save. */
  onCompleted?: () => void;
}

export function ReportSheet({
  visit,
  open,
  onClose,
  mode = 'edit',
  onCompleted,
}: Props) {
  const { t } = useLocale();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin' || role === 'project_manager';
  const updateVisit = useUpdateVisit();
  const isCompleteMode = mode === 'complete';

  const [workerNotes, setWorkerNotes] = useState(visit.workerNotes ?? '');
  const [managerNotes, setManagerNotes] = useState(visit.managerNotes ?? '');

  const handleSave = async () => {
    await updateVisit.mutateAsync({
      id: visit.id,
      input: {
        workerNotes,
        ...(isAdmin ? { managerNotes } : {}),
        ...(isCompleteMode
          ? { status: 'completed' as const, completedAt: new Date().toISOString() }
          : {}),
      },
    });
    toast.success(isCompleteMode ? t('diary.markComplete') : t('common.save'));
    if (isCompleteMode) onCompleted?.();
    onClose();
  };

  const primaryLabel = updateVisit.isPending
    ? isCompleteMode
      ? t('diary.completing')
      : t('common.saving')
    : isCompleteMode
      ? t('diary.markComplete')
      : t('common.save');

  return (
    <BottomSheet open={open} onClose={onClose} title={t('diary.report')}>
      <div className="space-y-4 pb-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t('diary.reportPlaceholder')}</label>
          <textarea
            className="min-h-[120px] w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder={t('diary.reportPlaceholder')}
            value={workerNotes}
            onChange={(e) => setWorkerNotes(e.target.value)}
            autoFocus
          />
        </div>

        {isAdmin && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">{t('diary.managerNotes')}</label>
            <textarea
              className="min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={t('diary.managerNotes')}
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
            />
          </div>
        )}

        <div className="flex gap-2 rtl:flex-row-reverse">
          <Button
            onClick={handleSave}
            disabled={updateVisit.isPending}
            className={
              isCompleteMode
                ? 'flex-1 bg-green-600 text-white hover:bg-green-700'
                : 'flex-1'
            }
          >
            {primaryLabel}
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            {t('common.cancel')}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
