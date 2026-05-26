'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import { useLogout } from '@/lib/hooks/useAuth';

export function ProfileActionsSection() {
  const { t } = useLocale();
  const logout = useLogout();

  return (
    <div className="rounded-xl border bg-card p-4">
      <button
        onClick={logout}
        className="w-full rounded-lg bg-destructive px-4 py-2.5 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
      >
        {t('profile.logout')}
      </button>
    </div>
  );
}
