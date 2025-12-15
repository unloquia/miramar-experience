/**
 * MapView Component
 * Interactive map with Leaflet showing places/ads
 */

'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import type { Ad, AdCategory } from '@/types/database';

// Dynamic import for Leaflet (required for SSR)
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

// Miramar center coordinates
const MIRAMAR_CENTER = { lat: -38.2667, lng: -57.8333 };
const DEFAULT_ZOOM = 14;

// Category colors for markers
const categoryColors: Record<AdCategory, string> = {
    gastronomia: '#ef4444', // red
    hoteleria: '#3b82f6',   // blue
    shopping: '#a855f7',    // purple
    aventura: '#22c55e',    // green
    nocturna: '#f59e0b',    // amber
};

interface MapViewProps {
    places: Ad[];
    selectedCategory?: AdCategory | null;
    className?: string;
    height?: string;
    showFilters?: boolean;
}

export function MapView({
    places,
    selectedCategory,
    className,
    height = '500px',
    showFilters = true
}: MapViewProps) {
    const [mounted, setMounted] = useState(false);
    const [filter, setFilter] = useState<AdCategory | null>(selectedCategory || null);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);

    useEffect(() => {
        setMounted(true);
        // Import Leaflet only on client
        import('leaflet').then((leaflet) => {
            setL(leaflet);
        });
    }, []);

    // Filter places with valid coordinates
    const placesWithLocation = places.filter(
        (p) => p.lat !== null && p.lng !== null && p.show_on_map
    );

    const filteredPlaces = filter
        ? placesWithLocation.filter((p) => p.category === filter)
        : placesWithLocation;

    // Create custom icon
    const createIcon = (category: AdCategory) => {
        if (!L) return undefined;

        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
        background-color: ${categoryColors[category]};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
        });
    };

    if (!mounted) {
        return (
            <div
                className={cn("bg-muted animate-pulse rounded-xl flex items-center justify-center", className)}
                style={{ height }}
            >
                <p className="text-muted-foreground">Cargando mapa...</p>
            </div>
        );
    }

    const categories: { key: AdCategory; label: string; icon: string }[] = [
        { key: 'gastronomia', label: 'Gastronomía', icon: 'restaurant' },
        { key: 'hoteleria', label: 'Hotelería', icon: 'hotel' },
        { key: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
        { key: 'aventura', label: 'Aventura', icon: 'surfing' },
        { key: 'nocturna', label: 'Vida Nocturna', icon: 'nightlife' },
    ];

    return (
        <div className={cn("relative", className)}>
            {/* Category Filters */}
            {showFilters && (
                <div className="absolute top-4 left-4 z-[1000] flex flex-wrap gap-2 bg-card/90 backdrop-blur-sm p-2 rounded-lg shadow-lg">
                    <button
                        onClick={() => setFilter(null)}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                            filter === null
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                        )}
                    >
                        Todos
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setFilter(cat.key)}
                            className={cn(
                                "px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1",
                                filter === cat.key
                                    ? "text-white"
                                    : "bg-muted hover:bg-muted/80"
                            )}
                            style={filter === cat.key ? { backgroundColor: categoryColors[cat.key] } : {}}
                        >
                            <span className="material-symbols-outlined text-sm">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Map */}
            <MapContainer
                center={[MIRAMAR_CENTER.lat, MIRAMAR_CENTER.lng]}
                zoom={DEFAULT_ZOOM}
                className="rounded-xl z-0"
                style={{ height, width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {L && filteredPlaces.map((place) => (
                    <Marker
                        key={place.id}
                        position={[place.lat!, place.lng!]}
                        icon={createIcon(place.category)}
                    >
                        <Popup>
                            <div className="min-w-[200px]">
                                <img
                                    src={place.image_url}
                                    alt={place.business_name}
                                    className="w-full h-24 object-cover rounded-t-lg -mt-3 -mx-3 mb-2"
                                    style={{ width: 'calc(100% + 24px)' }}
                                />
                                <h3 className="font-bold text-sm">{place.business_name}</h3>
                                {place.address && (
                                    <p className="text-xs text-muted-foreground mt-1">📍 {place.address}</p>
                                )}
                                {place.description && (
                                    <p className="text-xs mt-1 line-clamp-2">{place.description}</p>
                                )}
                                <a
                                    href={`/place/${place.id}`}
                                    className="inline-block mt-2 text-xs font-medium text-primary hover:underline"
                                >
                                    Ver más →
                                </a>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 z-[1000] bg-card/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <p className="text-xs font-medium mb-2">Leyenda</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {categories.map((cat) => (
                        <div key={cat.key} className="flex items-center gap-1.5">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: categoryColors[cat.key] }}
                            />
                            <span className="text-xs">{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            {filteredPlaces.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-xl z-[1000]">
                    <div className="text-center p-6">
                        <span className="material-symbols-outlined text-4xl text-muted-foreground">location_off</span>
                        <p className="text-muted-foreground mt-2">
                            {filter ? 'No hay lugares en esta categoría' : 'No hay lugares con ubicación'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Leaflet CSS import component
export function LeafletCSS() {
    return (
        <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
        />
    );
}
