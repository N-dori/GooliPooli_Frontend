'use client';

import type { Client, CreateClientInput, UpdateClientInput } from '@/lib/types';
import { CreateClientSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateClient, useUpdateClient } from '@/lib/hooks/useClients';
import { useLocale } from '@/lib/i18n/LocaleContext';

interface Props {
  client?: Client;
}

export function ClientForm({ client }: Props) {
  const { t } = useLocale();
  const router = useRouter();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient(client?.id ?? '');
  const isEdit = Boolean(client);

  const form = useForm<CreateClientInput>({
    resolver: zodResolver(CreateClientSchema),
    defaultValues: {
      name: client?.name ?? '',
      address: client?.address ?? '',
      phone: client?.phone ?? '',
      note: client?.note ?? '',
      gateCode: client?.gateCode ?? '',
      latitude: client?.latitude ?? undefined,
      longitude: client?.longitude ?? undefined,
      projectId: client?.projectId ?? undefined,
    },
  });

  const onSubmit = async (data: CreateClientInput) => {
    if (isEdit) {
      await updateMutation.mutateAsync(data as UpdateClientInput);
      router.push(`/clients/${client!.id}`);
    } else {
      const created = await createMutation.mutateAsync(data);
      router.push(`/clients/${created.id}`);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="name">{t('clients.name')} *</Label>
        <Input id="name" {...form.register('name')} />
        {form.formState.errors.name && (
          <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="address">{t('clients.address')} *</Label>
        <Input id="address" {...form.register('address')} />
        {form.formState.errors.address && (
          <p className="text-xs text-destructive">{form.formState.errors.address.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">{t('clients.phone')}</Label>
        <Input id="phone" type="tel" {...form.register('phone')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="gateCode">{t('clients.gateCode')}</Label>
        <Input id="gateCode" {...form.register('gateCode')} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="note">{t('clients.notes')}</Label>
        <Input id="note" {...form.register('note')} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="latitude">{t('clients.latitude')}</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            {...form.register('latitude', { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="longitude">{t('clients.longitude')}</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            {...form.register('longitude', { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="flex gap-2 rtl:flex-row-reverse">
        <Button type="submit" disabled={isPending}>
          {isPending ? t('common.saving') : isEdit ? t('common.save') : t('clients.new')}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  );
}
