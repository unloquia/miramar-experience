/**
 * MapSection Component
 * Interactive map placeholder section
 */

export function MapSection() {
    return (
        <div className="w-full bg-[#f0f0eb] dark:bg-muted py-20">
            <div className="layout-container flex flex-col items-center px-4 md:px-10 lg:px-40">
                <div className="layout-content-container flex flex-col max-w-[1280px] w-full gap-10">

                    <div className="flex flex-col md:flex-row gap-10 items-center bg-card rounded-3xl p-6 md:p-10 shadow-sm">
                        {/* Info */}
                        <div className="flex-1 flex flex-col gap-6">
                            <h2 className="text-3xl font-bold text-foreground">Encuentra tu camino</h2>
                            <p className="text-muted-foreground">
                                Explora nuestro mapa interactivo para descubrir las playas más tranquilas, los senderos del Vivero Dunícola y los puntos gastronómicos imperdibles.
                            </p>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">pin_drop</span>
                                    <span className="text-foreground font-medium">Centro Cívico, Calle 21</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">directions_bus</span>
                                    <span className="text-foreground font-medium">Terminal de Ómnibus, Av. 40</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">forest</span>
                                    <span className="text-foreground font-medium">Vivero Dunícola Florentino Ameghino</span>
                                </div>
                            </div>
                            <button className="w-fit mt-4 px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-80 transition-colors">
                                Abrir Mapa Interactivo
                            </button>
                        </div>

                        {/* Map Placeholder */}
                        <div className="flex-1 w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-inner relative group cursor-pointer bg-muted">
                            <div
                                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                                style={{
                                    backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-57.8433,-38.2717,12,0/600x400@2x?access_token=pk.placeholder')`,
                                    backgroundColor: '#e5e5e0'
                                }}
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card p-3 rounded-full shadow-lg text-primary">
                                <span className="material-symbols-outlined text-3xl">map</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
