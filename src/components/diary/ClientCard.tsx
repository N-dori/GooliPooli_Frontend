'use client';

import type { VisitWithDetails } from '@/lib/types';
import { ClipboardList, MapPin, Navigation, Pencil, Phone } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { SingleClientMapModal } from '@/components/map/SingleClientMapModal';
import { useLocale } from '@/lib/i18n/LocaleContext';
import { useAuthStore } from '@/lib/stores/authStore';
import { ReportSheet } from './ReportSheet';

interface Props {
  visit: VisitWithDetails;
}

export function DiaryClientCard({ visit }: Props) {
  const { t } = useLocale();
  const role = useAuthStore((s) => s.user?.role);
  const isAdmin = role === 'admin';
  const client = visit.client;

  const [reportOpen, setReportOpen] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);

  if (!client) return null;

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(client.address)}`;

  return (
    <>
      <Card>
        <CardContent className="p-4">
          {/* Header */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{client.name}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                {client.address}
              </p>
            </div>
            {visit.project && (
              <Link
                href={`/projects/${visit.project.id}`}
                className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground hover:opacity-80"
              >
                {visit.project.name}
              </Link>
            )}
          </div>

          {/* Notes preview */}
          {visit.workerNotes && (
            <p className="mb-3 rounded-md bg-muted/50 px-2 py-1.5 text-xs text-muted-foreground line-clamp-2">
              {visit.workerNotes}
            </p>
          )}

          {/* Action row */}
          <div className="flex items-center gap-1 rtl:flex-row-reverse">
            {/* Phone */}
            {client.phone && (
              <a
                href={`tel:${client.phone}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label={t('diary.phone')}
              >
                <Phone className="h-4 w-4" />
              </a>
            )}

            {/* Navigate */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label={t('diary.navigate')}
            >
              <Navigation className="h-4 w-4" />
            </a>

            {/* Map modal */}
            <button
              onClick={() => setMapOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label={t('diary.map')}
            >
              <MapPin className="h-4 w-4" />
            </button>

            {/* Report */}
            <button
              onClick={() => setReportOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              aria-label={t('diary.report')}
            >
              <ClipboardList className="h-4 w-4" />
            </button>

            {/* Edit (admin only) */}
            {isAdmin && (
              <Link
                href={`/clients/${client.id}`}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                aria-label={t('common.edit')}
              >
                <Pencil className="h-4 w-4" />
              </Link>
            )}
          </div>
        </CardContent>
      </Card>

      {reportOpen && (
        <ReportSheet visit={visit} open={reportOpen} onClose={() => setReportOpen(false)} />
      )}
      {mapOpen && client && (
        <SingleClientMapModal client={client} open={mapOpen} onClose={() => setMapOpen(false)} />
      )}
    </>
  );
}
