import { Suspense } from 'react';
import { Navbar, Footer } from '@/components/landing';
import { getAllPlaces } from '@/lib/data/ads';
import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Phone, Clock, Filter, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const dynamic = 'force-dynamic';

function PlaceCard({ place }: { place: any }) {
    const isPremium = place.tier === 'hero' || place.tier === 'featured';

    return (
        <Link
            href={`/place/${place.id}`}
            className={`group bg-card rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col md:flex-row h-full md:h-48 ${isPremium ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border'}`}
        >
            {/* Image Side */}
            <div className="md:w-48 h-48 md:h-full relative shrink-0">
                <Image
                    src={place.image_url || '/images/hero-placeholder.jpg'}
                    alt={place.business_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {isPremium && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px]">star</span>
                        Destacado
                    </div>
                )}
            </div>

            {/* Content Side */}
            <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-1 block">
                                {place.category}
                            </span>
                            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {place.business_name}
                            </h3>
                        </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {place.description || 'Descubre este increíble lugar en Miramar...'}
                    </p>

                    {place.address && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mb-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{place.address}</span>
                        </div>
                    )}
                </div>

                <div className="pt-3 mt-auto border-t border-border flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Ver detalles</span>
                    <ArrowRight className="w-4 h-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                </div>
            </div>
        </Link>
    );
}

export default async function GuiaPage({ searchParams }: { searchParams: { q?: string; category?: string } }) {
    const query = searchParams.q || '';
    const category = searchParams.category || '';

    // Obtener datos (Server Side)
    const places = await getAllPlaces({ query, category });

    const categories = [
        { id: '', label: 'Todo' },
        { id: 'gastronomia', label: 'Gastronomía' },
        { id: 'hoteleria', label: 'Hotelería' },
        { id: 'shopping', label: 'Comercios' },
        { id: 'aventura', label: 'Aventura' },
        { id: 'nocturna', label: 'Nocturna' },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                {/* Header */}
                <div className="px-4 md:px-10 lg:px-40 mb-10">
                    <div className="max-w-[1280px] mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black mb-4">Guía Comercial </h1>
                                <p className="text-muted-foreground text-lg max-w-2xl">
                                    Encontrá todo lo que buscás en Miramar. Desde restaurantes y hoteles hasta servicios y aventuras.
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="hidden md:flex gap-8">
                                <div className="text-right">
                                    <span className="block text-3xl font-bold text-primary">{places.length}</span>
                                    <span className="text-sm text-muted-foreground">Lugares encontrados</span>
                                </div>
                            </div>
                        </div>

                        {/* Search & Filters Bar */}
                        <div className="bg-card w-full rounded-2xl shadow-sm border p-4 flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <form className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <input
                                    name="q"
                                    type="text"
                                    placeholder="¿Qué estás buscando? (ej: 'hamburguesas', 'hotel')"
                                    defaultValue={query}
                                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-background border ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                />
                                {category && <input type="hidden" name="category" value={category} />}
                            </form>

                            {/* Categories Chips */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                                {categories.map(cat => (
                                    <Link
                                        key={cat.id}
                                        href={`/guia?${new URLSearchParams({ ...(query ? { q: query } : {}), category: cat.id }).toString()}`}
                                        className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${(category === cat.id)
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80 text-foreground'
                                            }`}
                                    >
                                        {cat.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Grid */}
                <div className="px-4 md:px-10 lg:px-40">
                    <div className="max-w-[1280px] mx-auto">
                        {places.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {places.map((place) => (
                                    <PlaceCard key={place.id} place={place} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No encontramos resultados</h3>
                                <p className="text-muted-foreground">Probá con otra categoría o término de búsqueda.</p>
                                <Link href="/guia" className="inline-block mt-4 text-primary font-bold hover:underline">
                                    Ver todos los lugares
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
