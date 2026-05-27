'use client';

import type { Client, CreateClientInput, UpdateClientInput } from '@/lib/types';
import { CreateClientSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateClient, useUpdateClient } from '@/lib/hooks/useClients';
import { useLocale } from '@/lib/i18n/LocaleContext';

interface ClientFormProps {
  client?: Client;
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

/** Geocode a free-text address → { lat, lng } using the Google Geocoding REST API. */
async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address.trim() || !MAPS_KEY) return null;
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_KEY}`,
    );
    const json = (await res.json()) as {
      results: { geometry: { location: { lat: number; lng: number } } }[];
    };
    const loc = json.results?.[0]?.geometry?.location;
    return loc ?? null;
  } catch {
    return null;
  }
}

export function ClientForm({ client }: ClientFormProps) {
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
    },
  });

  const lat = form.watch('latitude');
  const lng = form.watch('longitude');
  const hasCoords = lat != null && lng != null;

  /** Called when the address field loses focus — resolve coordinates silently. */
  const handleAddressBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    form.register('address').onBlur(e);
    const coords = await geocodeAddress(e.target.value);
    if (coords) {
      form.setValue('latitude', coords.lat);
      form.setValue('longitude', coords.lng);
    }
  };

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
        <Input
          id="address"
          placeholder={t('clients.addressPlaceholder')}
          {...form.register('address')}
          onBlur={handleAddressBlur}
        />
        {hasCoords && (
          <p className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <MapPin className="h-3 w-3" />
            {t('clients.locationPinned')}
          </p>
        )}
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
