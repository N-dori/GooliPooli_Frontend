'use client';

import type { Client } from '@/lib/types';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
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

  // Deduplicate clients by id (one pin per unique client)
  const clientMap: Record<string, Client> = {};
  visibleVisits.forEach((v) => {
    if (v.client && v.client.latitude != null && v.client.longitude != null) {
      clientMap[v.clientId] = v.client;
    }
  });
  const pins = Object.values(clientMap);

  const prevDay = () => setSelectedDate((d) => new Date(d.getTime() - 86400000));
  const nextDay = () => setSelectedDate((d) => new Date(d.getTime() + 86400000));

  // Default map center (first pin or a generic location)
  const defaultCenter =
    pins.length > 0
      ? { lat: pins[0].latitude!, lng: pins[0].longitude! }
      : { lat: 32.0853, lng: 34.7818 }; // Tel Aviv fallback

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 8rem)' }}>
      <h1 className="mb-3 text-2xl font-semibold tracking-tight">{t('map.title')}</h1>

      {/* Date selector */}
      <div className="mb-3 flex items-center justify-between rounded-xl border bg-card px-4 py-2">
        <button onClick={prevDay} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        <span className="text-sm font-medium">{formatDateLabel(selectedDate)}</span>
        <button onClick={nextDay} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent">
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>

      {/* Map */}
      {!MAPS_KEY ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border text-sm text-muted-foreground">
          {t('map.apiKeyMissing')}
        </div>
      ) : isLoading ? (
        <div className="flex-1 animate-pulse rounded-xl bg-muted/40" />
      ) : pins.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
          {t('map.noClients')}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden rounded-xl border">
          <APIProvider apiKey={MAPS_KEY}>
            <Map
              defaultCenter={defaultCenter}
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
          </APIProvider>
        </div>
      )}
    </div>
  );
}
