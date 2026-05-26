'use client';

import { Badge } from '@/components/ui/badge';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';

const ROLE_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  admin: 'default',
  project_manager: 'secondary',
  worker: 'outline',
};

export function ProfileAccountSection() {
  const { t } = useLocale();
  const user = useAuthStore((s) => s.user);
  const initials = user?.username.slice(0, 2).toUpperCase() ?? '?';

  return (
    <div className="rounded-xl border bg-card p-4">
      <h2 className="mb-4 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        {t('profile.account')}
      </h2>
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xl font-bold text-primary-foreground">
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt={user.username} className="h-full w-full object-cover" />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div className="space-y-1">
          <p className="font-semibold">{user?.username}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('profile.role')}:</span>
            <Badge variant={ROLE_VARIANT[user?.role ?? 'worker'] ?? 'outline'}>
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
