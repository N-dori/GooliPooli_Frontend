'use client';

import type { Client } from '@/lib/types';
import { APIProvider, AdvancedMarker, InfoWindow, Map } from '@vis.gl/react-google-maps';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { useLocale } from '@/lib/i18n/LocaleContext';

interface Props {
  client: Client;
  open: boolean;
  onClose: () => void;
}

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export function SingleClientMapModal({ client, open, onClose }: Props) {
  const { t } = useLocale();
  const [infoOpen, setInfoOpen] = useState(true);

  const lat = client.latitude ?? 0;
  const lng = client.longitude ?? 0;
  const hasCoords = client.latitude != null && client.longitude != null;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`;

  return (
    <BottomSheet open={open} onClose={onClose} title={client.name} className="h-[70vh]">
      {!MAPS_KEY ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          {t('map.apiKeyMissing')}
        </div>
      ) : !hasCoords ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">No GPS coordinates — navigate by address.</p>
          <Button asChild className="w-full">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              🧭 {t('map.directions')}
            </a>
          </Button>
        </div>
      ) : (
        <APIProvider apiKey={MAPS_KEY}>
          <div className="h-[50vh] w-full overflow-hidden rounded-lg">
            <Map
              defaultCenter={{ lat, lng }}
              defaultZoom={15}
              mapId="single-client-map"
              gestureHandling="greedy"
              disableDefaultUI
            >
              <AdvancedMarker
                position={{ lat, lng }}
                onClick={() => setInfoOpen(true)}
              />
              {infoOpen && (
                <InfoWindow
                  position={{ lat, lng }}
                  onCloseClick={() => setInfoOpen(false)}
                >
                  <div className="space-y-1 p-1 text-sm">
                    <p className="font-semibold">{client.name}</p>
                    <p className="text-muted-foreground">{client.address}</p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      🧭 {t('map.directions')}
                    </a>
                  </div>
                </InfoWindow>
              )}
            </Map>
          </div>
          <Button className="mt-3 w-full" asChild>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              🧭 {t('map.directions')}
            </a>
          </Button>
        </APIProvider>
      )}
    </BottomSheet>
  );
}
