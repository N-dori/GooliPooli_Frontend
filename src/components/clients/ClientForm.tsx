'use client';

import type { Client, CreateClientInput, UpdateClientInput } from '@/lib/types';
import { CreateClientSchema } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { visitsApi } from '@/lib/api/visits';
import { useCreateClient, useUpdateClient } from '@/lib/hooks/useClients';
import { visitKeys } from '@/lib/hooks/useVisits';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { cn } from '@/lib/utils';

interface ClientFormProps {
  client?: Client;
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// JS getDay(): 0 = Sunday … 6 = Saturday. Work week here is Sun–Thu.
const WEEKDAY_OPTIONS: { value: 0 | 1 | 2 | 3 | 4; key: string }[] = [
  { value: 0, key: 'clients.weekday.sun' },
  { value: 1, key: 'clients.weekday.mon' },
  { value: 2, key: 'clients.weekday.tue' },
  { value: 3, key: 'clients.weekday.wed' },
  { value: 4, key: 'clients.weekday.thu' },
];

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

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Combine "YYYY-MM-DD" + "HH:MM" into a full ISO string with the local TZ offset. */
function toLocalIso(date: string, time: string): string {
  const d = new Date(`${date}T${time}:00`);
  const pad = (n: number) => String(n).padStart(2, '0');
  const tzMin = -d.getTimezoneOffset();
  const sign = tzMin >= 0 ? '+' : '-';
  const tzh = pad(Math.floor(Math.abs(tzMin) / 60));
  const tzm = pad(Math.abs(tzMin) % 60);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00${sign}${tzh}:${tzm}`;
}

/** Every date in the current calendar month whose weekday is in `weekdays`. */
function datesForWeekdaysThisMonth(weekdays: Set<number>): string[] {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const lastDay = new Date(year, month + 1, 0).getDate();
  const out: string[] = [];
  for (let d = 1; d <= lastDay; d++) {
    const date = new Date(year, month, d);
    if (weekdays.has(date.getDay())) out.push(toDateStr(date));
  }
  return out;
}

export function ClientForm({ client }: ClientFormProps) {
  const { t } = useLocale();
  const router = useRouter();
  const qc = useQueryClient();
  const createMutation = useCreateClient();
  const updateMutation = useUpdateClient(client?.id ?? '');
  const isEdit = Boolean(client);

  const existingWeekdays = (client?.recurringSchedule as { weekdays?: number[] } | null)?.weekdays;
  const [weekdays, setWeekdays] = useState<Set<number>>(
    new Set(existingWeekdays ?? []),
  );
  const [applyForMonth, setApplyForMonth] = useState(false);
  const [generatingVisits, setGeneratingVisits] = useState(false);
  const [oneTimeDate, setOneTimeDate] = useState('');
  const [oneTimeTime, setOneTimeTime] = useState('');
  const [managerNotes, setManagerNotes] = useState('');

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
      visitsPerMonth: client?.visitsPerMonth ?? undefined,
      isOneTime: client?.isOneTime ?? false,
    },
  });

  const lat = form.watch('latitude');
  const lng = form.watch('longitude');
  const isOneTime = form.watch('isOneTime');
  const hasCoords = lat != null && lng != null;

  const toggleWeekday = (v: number) => {
    setWeekdays((prev) => {
      const next = new Set(prev);
      if (next.has(v)) next.delete(v);
      else next.add(v);
      return next;
    });
  };

  const handleAddressBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    form.register('address').onBlur(e);
    const coords = await geocodeAddress(e.target.value);
    if (coords) {
      form.setValue('latitude', coords.lat);
      form.setValue('longitude', coords.lng);
    }
  };

  const onSubmit = async (data: CreateClientInput) => {
    const payload: CreateClientInput = {
      ...data,
      recurringSchedule:
        !data.isOneTime && weekdays.size > 0
          ? { weekdays: Array.from(weekdays).sort(), intervalWeeks: 1 }
          : null,
    };

    if (isEdit) {
      await updateMutation.mutateAsync(payload as UpdateClientInput);
      router.push(`/clients/${client!.id}`);
      return;
    }

    const created = await createMutation.mutateAsync(payload);

    // Visit metadata copied from the client form onto every generated visit.
    const visitMeta = {
      gpsLatitude: created.latitude ?? data.latitude ?? null,
      gpsLongitude: created.longitude ?? data.longitude ?? null,
      managerNotes: managerNotes.trim() || null,
    };

    if (data.isOneTime) {
      if (oneTimeDate && oneTimeTime) {
        setGeneratingVisits(true);
        try {
          await visitsApi.create({
            clientId: created.id,
            scheduledDate: toLocalIso(oneTimeDate, oneTimeTime),
            ...visitMeta,
          });
          qc.invalidateQueries({ queryKey: visitKeys.all });
          toast.success('Visit scheduled');
        } catch (err) {
          toast.error((err as Error).message);
        } finally {
          setGeneratingVisits(false);
        }
      }
    } else if (applyForMonth && weekdays.size > 0) {
      const dates = datesForWeekdaysThisMonth(weekdays);
      if (dates.length > 0) {
        setGeneratingVisits(true);
        try {
          await Promise.all(
            dates.map((scheduledDate) =>
              visitsApi.create({
                clientId: created.id,
                scheduledDate,
                ...visitMeta,
              }),
            ),
          );
          qc.invalidateQueries({ queryKey: visitKeys.all });
          toast.success(`${dates.length} draft visit${dates.length === 1 ? '' : 's'} created`);
        } catch (err) {
          toast.error((err as Error).message);
        } finally {
          setGeneratingVisits(false);
        }
      }
    }

    router.push(`/clients/${created.id}`);
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending || generatingVisits;

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

      {!isEdit && (
        <div className="space-y-1.5">
          <Label htmlFor="managerNotes">{t('clients.managerNotes')}</Label>
          <textarea
            id="managerNotes"
            value={managerNotes}
            onChange={(e) => setManagerNotes(e.target.value)}
            placeholder={t('clients.managerNotesPlaceholder')}
            className="min-h-[80px] w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}

      <label className="flex items-center gap-2 text-sm rtl:flex-row-reverse">
        <input
          type="checkbox"
          className="rounded"
          {...form.register('isOneTime')}
        />
        {t('clients.isOneTime')}
      </label>

      {isOneTime ? (
        !isEdit && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="oneTimeDate">{t('clients.visitDate')}</Label>
              <Input
                id="oneTimeDate"
                type="date"
                value={oneTimeDate}
                onChange={(e) => setOneTimeDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="oneTimeTime">{t('clients.visitTime')}</Label>
              <Input
                id="oneTimeTime"
                type="time"
                value={oneTimeTime}
                onChange={(e) => setOneTimeTime(e.target.value)}
              />
            </div>
          </div>
        )
      ) : (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="visitsPerMonth">{t('clients.visitsPerMonth')}</Label>
            <Input
              id="visitsPerMonth"
              type="number"
              min={0}
              step={1}
              {...form.register('visitsPerMonth', {
                setValueAs: (v) => (v === '' || v === null ? undefined : Number(v)),
              })}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('clients.visitDays')}</Label>
            <div className="flex gap-2 rtl:flex-row-reverse">
              {WEEKDAY_OPTIONS.map(({ value, key }) => {
                const active = weekdays.has(value);
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => toggleWeekday(value)}
                    className={cn(
                      'flex h-10 w-12 items-center justify-center rounded-md border text-sm font-medium transition-colors',
                      active
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-muted-foreground hover:bg-accent',
                    )}
                    aria-pressed={active}
                  >
                    {t(key)}
                  </button>
                );
              })}
            </div>

            {!isEdit && (
              <label className="flex items-center gap-2 text-sm rtl:flex-row-reverse">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={applyForMonth}
                  onChange={(e) => setApplyForMonth(e.target.checked)}
                  disabled={weekdays.size === 0}
                />
                {t('clients.applyForWholeMonth')}
              </label>
            )}
          </div>
        </>
      )}

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
