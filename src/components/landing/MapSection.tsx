/**
 * MapSection Component
 * Interactive map section showing all places
 */

import { getPlacesForMap } from '@/lib/data/ads';
import { MapSectionClient } from './MapSectionClient';

export async function MapSection() {
    const places = await getPlacesForMap();

    return (
        <section id="mapa" className="w-full bg-[#f0f0eb] dark:bg-muted py-20">
            <div className="layout-container flex flex-col items-center px-4 md:px-10 lg:px-40">
                <div className="layout-content-container flex flex-col max-w-[1280px] w-full gap-10">

                    {/* Header */}
                    <div className="text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Explora Miramar
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Descubre todos los comercios, restaurantes, hoteles y lugares
                            de aventura de la ciudad. Filtrá por categoría y encontrá tu próximo destino.
                        </p>
                    </div>

                    {/* Map Component (Client) */}
                    <MapSectionClient places={places} />

                    {/* Info Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 flex items-start gap-4">
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary">pin_drop</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Centro Cívico</h3>
                                <p className="text-sm text-muted-foreground">Calle 21 entre 28 y 30</p>
                            </div>
                        </div>
                        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 flex items-start gap-4">
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary">directions_bus</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Terminal de Ómnibus</h3>
                                <p className="text-sm text-muted-foreground">Av. 40 y Diagonal Irigoyen</p>
                            </div>
                        </div>
                        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 flex items-start gap-4">
                            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-primary">forest</span>
                            </div>
                            <div>
                                <h3 className="font-semibold">Vivero Dunícola</h3>
                                <p className="text-sm text-muted-foreground">Florentino Ameghino</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
