/**
 * Place Detail Page
 * Shows full information about a business/place
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdById } from '@/lib/data/ads';
import { categoryInfo } from '@/lib/schemas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, ExternalLink, MessageCircle, Share2 } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

// Dynamic metadata
export async function generateMetadata({
    params
}: {
    params: Promise<{ id: string }>
}): Promise<Metadata> {
    const { id } = await params;
    const place = await getAdById(id);

    if (!place) {
        return { title: 'Lugar no encontrado' };
    }

    return {
        title: `${place.business_name} | Miramar Experience`,
        description: place.long_description || place.description || `Descubre ${place.business_name} en Miramar`,
        openGraph: {
            title: place.business_name,
            description: place.description || '',
            images: [place.image_url],
        },
    };
}

export default async function PlacePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const place = await getAdById(id);

    if (!place) {
        notFound();
    }

    const category = categoryInfo[place.category];
    const hasLocation = place.lat !== null && place.lng !== null;

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Image */}
            <div className="relative h-[50vh] min-h-[400px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${place.image_url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                {/* Back Button */}
                <div className="absolute top-4 left-4 z-10">
                    <Link href="/">
                        <Button variant="secondary" size="sm" className="backdrop-blur-sm bg-card/80">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                    </Link>
                </div>

                {/* Share Button */}
                <div className="absolute top-4 right-4 z-10">
                    <Button variant="secondary" size="icon" className="backdrop-blur-sm bg-card/80">
                        <Share2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 -mt-32 relative z-10">
                <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                            <Badge
                                variant="secondary"
                                className="mb-3 flex items-center gap-1 w-fit"
                            >
                                <span className="material-symbols-outlined text-sm">{category.icon}</span>
                                {category.label}
                            </Badge>
                            <h1 className="text-3xl md:text-4xl font-bold">{place.business_name}</h1>
                            {place.address && (
                                <p className="flex items-center gap-2 text-muted-foreground mt-2">
                                    <MapPin className="h-4 w-4" />
                                    {place.address}
                                </p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            {place.redirect_url && (
                                <a href={place.redirect_url} target="_blank" rel="noopener noreferrer">
                                    <Button className="gap-2">
                                        {place.redirect_url.includes('wa.me') ? (
                                            <>
                                                <MessageCircle className="h-4 w-4" />
                                                WhatsApp
                                            </>
                                        ) : (
                                            <>
                                                <ExternalLink className="h-4 w-4" />
                                                Visitar
                                            </>
                                        )}
                                    </Button>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
                        <p className="text-lg leading-relaxed">
                            {place.long_description || place.description || 'Sin descripción disponible.'}
                        </p>
                    </div>

                    {/* Gallery */}
                    {place.gallery_urls && place.gallery_urls.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Galería</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {place.gallery_urls.map((url, index) => (
                                    <div
                                        key={index}
                                        className="aspect-video rounded-lg overflow-hidden bg-muted"
                                    >
                                        <img
                                            src={url}
                                            alt={`${place.business_name} - Foto ${index + 1}`}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Map */}
                    {hasLocation && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">Ubicación</h2>
                            <div className="rounded-xl overflow-hidden border border-border">
                                <iframe
                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng! - 0.005},${place.lat! - 0.003},${place.lng! + 0.005},${place.lat! + 0.003}&layer=mapnik&marker=${place.lat},${place.lng}`}
                                    width="100%"
                                    height="300"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    title={`Mapa de ${place.business_name}`}
                                />
                            </div>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-3 text-sm text-primary hover:underline"
                            >
                                <ExternalLink className="h-4 w-4" />
                                Abrir en Google Maps
                            </a>
                        </div>
                    )}

                    {/* Info Tags */}
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-border">
                        <Badge variant="outline" className="gap-1">
                            <span className="material-symbols-outlined text-sm">{category.icon}</span>
                            {category.label}
                        </Badge>
                        {place.tier === 'hero' && (
                            <Badge className="bg-amber-500 hover:bg-amber-600">⭐ Destacado</Badge>
                        )}
                        {place.tier === 'featured' && (
                            <Badge className="bg-primary">✨ Recomendado</Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer Spacer */}
            <div className="h-20" />
        </div>
    );
}
