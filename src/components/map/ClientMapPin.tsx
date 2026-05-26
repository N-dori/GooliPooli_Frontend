'use client';

import type { Client } from '@/lib/types';
import { AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { useLocale } from '@/lib/i18n/LocaleContext';

interface Props {
  client: Client;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

export function ClientMapPin({ client }: Props) {
  const { t } = useLocale();
  const [infoOpen, setInfoOpen] = useState(false);

  const lat = client.latitude ?? 0;
  const lng = client.longitude ?? 0;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`;

  return (
    <>
      <AdvancedMarker
        position={{ lat, lng }}
        onClick={() => setInfoOpen(true)}
      >
        <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md ring-2 ring-white">
          {getInitials(client.name)}
        </div>
      </AdvancedMarker>

      {infoOpen && (
        <InfoWindow
          position={{ lat, lng }}
          onCloseClick={() => setInfoOpen(false)}
        >
          <div className="space-y-1 p-1 text-sm">
            <p className="font-semibold">{client.name}</p>
            <p className="text-xs text-muted-foreground">{client.address}</p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 underline text-xs"
            >
              🧭 {t('map.directions')}
            </a>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
