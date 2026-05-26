'use client';

import type { Client } from '@/lib/types';
import { Map } from '@vis.gl/react-google-maps';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useVisitsByDate } from '@/lib/hooks/useVisits';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';
import { ClientMapPin } from './ClientMapPin';

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDateLabel(date: Date) {
  return date.toLocaleDateString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Default centre: Tel Aviv
const TEL_AVIV = { lat: 32.0853, lng: 34.7818 };

export function MapPage() {
  const { t } = useLocale();
  const user = useAuthStore((s) => s.user);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = toDateStr(selectedDate);

  const { data, isLoading } = useVisitsByDate(dateStr);

  const allVisits = data?.items ?? [];
  const visibleVisits =
    user?.role === 'worker'
      ? allVisits.filter((v) => v.workerId === user.id)
      : allVisits;

  // Deduplicate clients by id — one pin per unique client
  const clientMap: Record<string, Client> = {};
  visibleVisits.forEach((v) => {
    if (v.client && v.client.latitude != null && v.client.longitude != null) {
      clientMap[v.clientId] = v.client;
    }
  });
  const pins = Object.values(clientMap);

  const prevDay = () => setSelectedDate((d) => new Date(d.getTime() - 86400000));
  const nextDay = () => setSelectedDate((d) => new Date(d.getTime() + 86400000));

  const mapCenter =
    pins.length > 0
      ? { lat: pins[0].latitude!, lng: pins[0].longitude! }
      : TEL_AVIV;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight">{t('map.title')}</h1>

      {/* Date selector */}
      <div className="mb-3 flex items-center justify-between rounded-xl border bg-card px-4 py-2">
        <button
          onClick={prevDay}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        <span className="text-sm font-medium">{formatDateLabel(selectedDate)}</span>
        <button
          onClick={nextDay}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
        >
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>

      {/* Map */}
      {!MAPS_KEY ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border text-sm text-muted-foreground">
          {t('map.apiKeyMissing')}
        </div>
      ) : (
        <div className="relative flex-1 overflow-hidden rounded-xl border">
          {/* Loading overlay — map stays mounted so it doesn't flash */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <span className="text-sm text-muted-foreground">{t('common.loading')}</span>
            </div>
          )}

          <Map
            key={dateStr}           // recenter when date changes
            defaultCenter={mapCenter}
            defaultZoom={13}
            mapId="day-map"
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: '100%', height: '100%' }}
          >
            {pins.map((client) => (
              <ClientMapPin key={client.id} client={client} />
            ))}
          </Map>

          {/* "No clients" badge drawn on top of the map */}
          {!isLoading && pins.length === 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
              <span className="rounded-full bg-background/90 px-4 py-2 text-sm text-muted-foreground shadow">
                {t('map.noClients')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
