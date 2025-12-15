/**
 * MapSectionClient Component
 * Client-side wrapper for the interactive map
 */

'use client';

import { Ad } from '@/types/database';
import { MapView } from './MapView';

interface MapSectionClientProps {
    places: Ad[];
}

export function MapSectionClient({ places }: MapSectionClientProps) {
    const hasPlaces = places.length > 0;

    return (
        <div className="bg-card rounded-3xl p-4 md:p-6 shadow-lg overflow-hidden">
            {hasPlaces ? (
                <MapView
                    places={places}
                    height="500px"
                    showFilters={true}
                    className="rounded-xl"
                />
            ) : (
                <div className="h-[500px] flex flex-col items-center justify-center bg-muted rounded-xl">
                    <span className="material-symbols-outlined text-6xl text-muted-foreground mb-4">
                        explore
                    </span>
                    <h3 className="text-xl font-semibold mb-2">Mapa Próximamente</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        Estamos agregando ubicaciones para que puedas explorar
                        todos los comercios de Miramar en el mapa.
                    </p>
                </div>
            )}
        </div>
    );
}
