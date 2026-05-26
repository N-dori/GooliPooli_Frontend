'use client';

import { useLocale } from '@/lib/i18n/LocaleContext';
import { ProfileAccountSection } from './ProfileAccountSection';
import { ProfileActionsSection } from './ProfileActionsSection';
import { ProfilePreferencesSection } from './ProfilePreferencesSection';

export function ProfilePage() {
  const { t } = useLocale();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{t('profile.title')}</h1>
      <ProfileAccountSection />
      <ProfilePreferencesSection />
      <ProfileActionsSection />
    </div>
  );
}
