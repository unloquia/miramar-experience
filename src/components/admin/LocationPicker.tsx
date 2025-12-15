/**
 * LocationPicker Component
 * Interactive map for admin to select coordinates
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, X } from 'lucide-react';

// Dynamic imports for Leaflet
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

// Dynamic import for MapClickHandler
const MapClickHandler = dynamic(
    () => import('./MapClickHandler').then((mod) => mod.MapClickHandler),
    { ssr: false }
);

// Miramar center
const MIRAMAR_CENTER = { lat: -38.2667, lng: -57.8333 };
const MIRAMAR_BOUNDS = {
    minLat: -38.35, maxLat: -38.20,
    minLng: -57.95, maxLng: -57.75
};

interface LocationPickerProps {
    initialLat?: number | null;
    initialLng?: number | null;
    initialAddress?: string | null;
    onLocationChange: (location: { lat: number | null; lng: number | null; address: string | null }) => void;
}

export function LocationPicker({
    initialLat,
    initialLng,
    initialAddress,
    onLocationChange
}: LocationPickerProps) {
    const [mounted, setMounted] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [lat, setLat] = useState<number | null>(initialLat || null);
    const [lng, setLng] = useState<number | null>(initialLng || null);
    const [address, setAddress] = useState(initialAddress || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [L, setL] = useState<typeof import('leaflet') | null>(null);

    useEffect(() => {
        setMounted(true);
        import('leaflet').then((leaflet) => {
            setL(leaflet);
        });
    }, []);

    // Notify parent of changes
    const updateLocation = useCallback((newLat: number | null, newLng: number | null, newAddress: string | null) => {
        setLat(newLat);
        setLng(newLng);
        if (newAddress !== null) setAddress(newAddress);
        onLocationChange({ lat: newLat, lng: newLng, address: newAddress || address });
    }, [onLocationChange, address]);

    // Handle map click
    const handleMapClick = (clickLat: number, clickLng: number) => {
        // Validate within Miramar bounds
        if (
            clickLat < MIRAMAR_BOUNDS.minLat || clickLat > MIRAMAR_BOUNDS.maxLat ||
            clickLng < MIRAMAR_BOUNDS.minLng || clickLng > MIRAMAR_BOUNDS.maxLng
        ) {
            alert('La ubicación debe estar dentro de Miramar');
            return;
        }
        updateLocation(clickLat, clickLng, null);
    };

    // Search address using Nominatim (free geocoding)
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const query = `${searchQuery}, Miramar, Buenos Aires, Argentina`;
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
            );
            const results = await response.json();

            if (results.length > 0) {
                const { lat: foundLat, lon: foundLng, display_name } = results[0];
                const parsedLat = parseFloat(foundLat);
                const parsedLng = parseFloat(foundLng);

                // Validate within Miramar
                if (
                    parsedLat >= MIRAMAR_BOUNDS.minLat && parsedLat <= MIRAMAR_BOUNDS.maxLat &&
                    parsedLng >= MIRAMAR_BOUNDS.minLng && parsedLng <= MIRAMAR_BOUNDS.maxLng
                ) {
                    updateLocation(parsedLat, parsedLng, searchQuery);
                } else {
                    alert('La dirección encontrada está fuera de Miramar');
                }
            } else {
                alert('No se encontró la dirección. Intenta ser más específico.');
            }
        } catch (error) {
            console.error('Search error:', error);
            alert('Error al buscar la dirección');
        }
        setIsSearching(false);
    };

    // Clear location
    const handleClear = () => {
        updateLocation(null, null, '');
        setSearchQuery('');
    };

    const createMarkerIcon = () => {
        if (!L) return undefined;
        return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
        background-color: #ef4444;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 2px 12px rgba(0,0,0,0.4);
      "></div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ubicación en el Mapa
                </Label>
                {lat && lng && (
                    <Button type="button" variant="ghost" size="sm" onClick={handleClear}>
                        <X className="h-4 w-4 mr-1" />
                        Limpiar
                    </Button>
                )}
            </div>

            {/* Current location display */}
            {lat && lng ? (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                        📍 Ubicación seleccionada: {lat.toFixed(6)}, {lng.toFixed(6)}
                    </p>
                    {address && (
                        <p className="text-sm text-green-700 dark:text-green-300 mt-1">{address}</p>
                    )}
                </div>
            ) : (
                <p className="text-sm text-muted-foreground">
                    No hay ubicación seleccionada. Hacé clic en el mapa o buscá una dirección.
                </p>
            )}

            {/* Toggle map button */}
            <Button
                type="button"
                variant="outline"
                onClick={() => setShowMap(!showMap)}
                className="w-full"
            >
                <MapPin className="h-4 w-4 mr-2" />
                {showMap ? 'Ocultar mapa' : 'Seleccionar en mapa'}
            </Button>

            {showMap && mounted && (
                <div className="space-y-3">
                    {/* Search bar */}
                    <div className="flex gap-2">
                        <Input
                            placeholder="Buscar dirección en Miramar..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                        />
                        <Button
                            type="button"
                            onClick={handleSearch}
                            disabled={isSearching}
                            size="icon"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Map */}
                    <div className="relative rounded-lg overflow-hidden border border-border">
                        <MapContainer
                            center={lat && lng ? [lat, lng] : [MIRAMAR_CENTER.lat, MIRAMAR_CENTER.lng]}
                            zoom={lat && lng ? 17 : 14}
                            style={{ height: '350px', width: '100%' }}
                            className="z-0"
                        >
                            <TileLayer
                                attribution='&copy; OpenStreetMap'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {/* Click handler */}
                            <MapClickHandler onMapClick={handleMapClick} />

                            {/* Marker */}
                            {lat && lng && L && (
                                <Marker
                                    position={[lat, lng]}
                                    icon={createMarkerIcon()}
                                />
                            )}
                        </MapContainer>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        💡 Hacé clic en el mapa para seleccionar la ubicación exacta
                    </p>
                </div>
            )}

            {/* Address input */}
            <div>
                <Label htmlFor="address">Dirección (texto)</Label>
                <Input
                    id="address"
                    placeholder="Ej: Av. Costanera 1234"
                    value={address}
                    onChange={(e) => {
                        setAddress(e.target.value);
                        onLocationChange({ lat, lng, address: e.target.value });
                    }}
                    className="mt-1"
                />
            </div>
        </div>
    );
}
