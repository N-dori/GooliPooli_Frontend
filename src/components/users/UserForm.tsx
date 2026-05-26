'use client';

import type { PublicUser } from '@/lib/types';
import { CreateUserSchema, UpdateUserSchema, UserRole } from '@/lib/types';
import type { CreateUserInput, UpdateUserInput } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUser, useUpdateUser } from '@/lib/hooks/useUsers';
import { useLocale } from '@/lib/i18n/LocaleContext';

interface Props {
  user?: PublicUser;
}

export function UserForm({ user }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const isEdit = Boolean(user);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser(user?.id ?? '');

  const createForm = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: { username: '', email: '', password: '', role: 'worker' },
  });

  const updateForm = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      username: user?.username ?? '',
      role: user?.role ?? 'worker',
      avatarUrl: user?.avatarUrl ?? '',
    },
  });

  const onCreateSubmit = async (data: CreateUserInput) => {
    const created = await createMutation.mutateAsync(data);
    router.push(`/users/${created.id}`);
  };

  const onUpdateSubmit = async (data: UpdateUserInput) => {
    await updateMutation.mutateAsync(data);
    router.push(`/users/${user!.id}`);
  };

  if (isEdit) {
    return (
      <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="username">{t('auth.username')}</Label>
          <Input id="username" {...updateForm.register('username')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="role">{t('users.role')}</Label>
          <select
            id="role"
            {...updateForm.register('role')}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {UserRole.options.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="avatarUrl">{t('users.avatarUrl')}</Label>
          <Input id="avatarUrl" type="url" {...updateForm.register('avatarUrl')} />
        </div>
        <div className="flex gap-2 rtl:flex-row-reverse">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? t('common.saving') : t('common.save')}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            {t('common.cancel')}
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="username">{t('auth.username')} *</Label>
        <Input id="username" {...createForm.register('username')} />
        {createForm.formState.errors.username && (
          <p className="text-xs text-destructive">{createForm.formState.errors.username.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">{t('auth.email')} *</Label>
        <Input id="email" type="email" {...createForm.register('email')} />
        {createForm.formState.errors.email && (
          <p className="text-xs text-destructive">{createForm.formState.errors.email.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">{t('users.temporaryPassword')} *</Label>
        <Input id="password" type="password" {...createForm.register('password')} />
        {createForm.formState.errors.password && (
          <p className="text-xs text-destructive">{createForm.formState.errors.password.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="role">{t('users.role')}</Label>
        <select
          id="role"
          {...createForm.register('role')}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {UserRole.options.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div className="flex gap-2 rtl:flex-row-reverse">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? t('common.creating') : t('users.new')}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  );
}
