import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAdById } from '@/lib/data/ads';
import { categoryInfo } from '@/lib/schemas';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Share2, ExternalLink, Instagram, Globe, Phone, Navigation } from 'lucide-react';
import type { Metadata } from 'next';
import { trackEvent } from '@/lib/actions/analytics';
import { ContactButton } from '@/components/landing/ContactButton';
import { PriceRange } from '@/types/database';

export const dynamic = 'force-dynamic';

// Helper for Features (Icon Mapping)
const FEATURES_MAP: Record<string, { label: string; icon: string }> = {
    wifi: { label: 'WiFi Gratis', icon: '📶' },
    pet_friendly: { label: 'Pet Friendly', icon: '🐾' },
    cards: { label: 'Acepta Tarjeta', icon: '💳' },
    mercadopago: { label: 'Mercado Pago', icon: '📱' },
    cash: { label: 'Solo Efectivo', icon: '💵' },
    outdoor: { label: 'Aire Libre', icon: '🌳' },
    ac: { label: 'Aire Acondicionado', icon: '❄️' },
    delivery: { label: 'Delivery', icon: '🛵' },
    parking: { label: 'Estacionamiento', icon: '🚗' },
};

// Helper for Price
const PRICE_MAP: Record<string, { label: string; symbol: string; color: string }> = {
    cheap: { label: 'Económico', symbol: '$', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' },
    moderate: { label: 'Moderado', symbol: '$$', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' },
    expensive: { label: 'Caro', symbol: '$$$', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' },
    luxury: { label: 'Lujo', symbol: '$$$$', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100' },
};

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

    // Analytics: Track View
    trackEvent(place.id, 'view_detail');

    const category = categoryInfo[place.category];
    const hasLocation = place.lat !== null && place.lng !== null;
    const priceInfo = place.price_range ? PRICE_MAP[place.price_range] : null;

    // Contact Links Logic
    const googleMapsUrl = hasLocation
        ? `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
        : null;

    // Normalize phone for WhatsApp link if needed
    const whatsappLink = place.phone
        ? place.phone.startsWith('http')
            ? place.phone
            : `https://wa.me/${place.phone.replace(/[^0-9]/g, '')}`
        : null;

    return (
        <div className="min-h-screen bg-background pb-20 md:pb-0">
            {/* Hero Image Section */}
            <div className="relative h-[60vh] min-h-[450px] md:h-[50vh]">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 md:bg-fixed"
                    style={{ backgroundImage: `url('${place.image_url}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/30 md:to-transparent" />

                {/* Navbar Action Area */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
                    <Link href="/guia">
                        <Button variant="secondary" size="sm" className="backdrop-blur-md bg-black/30 text-white hover:bg-black/50 border-0">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Explorar
                        </Button>
                    </Link>
                    {/* Share Button (Future Feature) */}
                    {/* <Button variant="secondary" size="icon" className="backdrop-blur-md bg-black/30 text-white border-0">
                        <Share2 className="h-4 w-4" />
                    </Button> */}
                </div>

                {/* Hero Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm px-3 py-1 text-sm border-0 gap-1.5">
                                <span className="material-symbols-outlined text-[16px]">{category.icon}</span>
                                {category.label}
                            </Badge>
                            {priceInfo && (
                                <Badge variant="outline" className={`${priceInfo.color} border-0 backdrop-blur-sm px-3`}>
                                    {priceInfo.symbol} • {priceInfo.label}
                                </Badge>
                            )}
                            {place.tier === 'hero' && (
                                <Badge className="bg-amber-500/90 hover:bg-amber-600 border-0 text-white">⭐ Recomendado</Badge>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2 leading-tight">
                            {place.business_name}
                        </h1>

                        {place.address && (
                            <p className="text-white/90 flex items-center gap-2 text-lg drop-shadow-sm font-medium">
                                <MapPin className="h-4 w-4 text-primary" />
                                {place.address}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-5xl mx-auto px-4 py-8 -mt-4 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Left Column: Details (2/3) */}
                    <div className="md:col-span-2 space-y-8">

                        {/* Description Card */}
                        <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50">
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <h3 className="text-xl font-semibold mb-3">Sobre este lugar</h3>
                                <p className="text-lg leading-relaxed text-muted-foreground whitespace-pre-line">
                                    {place.long_description || place.description || 'Sin descripción disponible.'}
                                </p>
                            </div>

                            {/* Amenities Grid */}
                            {place.features && place.features.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-border/50">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                        Servicios y Comodidades
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {place.features.map(featId => {
                                            const feature = FEATURES_MAP[featId];
                                            if (!feature) return null;
                                            return (
                                                <div key={featId} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/50 text-sm font-medium">
                                                    <span className="text-lg">{feature.icon}</span>
                                                    {feature.label}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Gallery Section */}
                        {place.gallery_urls && place.gallery_urls.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold px-2">Galería de Fotos</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {place.gallery_urls.map((url, index) => (
                                        <div
                                            key={index}
                                            className="aspect-video relative rounded-xl overflow-hidden bg-muted group cursor-zoom-in shadow-sm hover:shadow-lg transition-all"
                                        >
                                            <img
                                                src={url}
                                                alt={`${place.business_name} - Foto ${index + 1}`}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Key Info & Actions (1/3) */}
                    <div className="md:col-span-1 space-y-6">

                        {/* Action Card (Sticky on Desktop) */}
                        <div className="bg-card rounded-2xl p-5 shadow-lg border border-border sticky top-24">
                            <h3 className="font-semibold text-lg mb-4">Contacto Directo</h3>

                            <div className="space-y-3">
                                {/* WhatsApp / Phone */}
                                {place.phone && (
                                    <a
                                        href={whatsappLink || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 text-white shadow-green-900/10">
                                            <Phone className="mr-2 h-5 w-5" />
                                            {place.phone.length > 9 ? 'Enviar WhatsApp' : 'Llamar al Local'}
                                        </Button>
                                    </a>
                                )}

                                {/* Google Maps Navigation */}
                                {hasLocation && googleMapsUrl && (
                                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button variant="outline" className="w-full h-12 text-base border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary">
                                            <Navigation className="mr-2 h-5 w-5" />
                                            Cómo Llegar
                                        </Button>
                                    </a>
                                )}

                                {/* Instagram */}
                                {place.instagram_username && (
                                    <a
                                        href={`https://instagram.com/${place.instagram_username.replace('@', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button variant="outline" className="w-full border-border hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 dark:hover:bg-pink-950/30">
                                            <Instagram className="mr-2 h-4 w-4" />
                                            @{place.instagram_username}
                                        </Button>
                                    </a>
                                )}

                                {/* Website */}
                                {place.website_url && (
                                    <a href={place.website_url} target="_blank" rel="noopener noreferrer" className="block">
                                        <Button variant="ghost" className="w-full text-muted-foreground">
                                            <Globe className="mr-2 h-4 w-4" />
                                            Ver Sitio Web
                                        </Button>
                                    </a>
                                )}

                                {/* Legacy Redirect (Fallback) */}
                                {place.redirect_url && !place.phone && !place.website_url && (
                                    <ContactButton
                                        adId={place.id}
                                        url={place.redirect_url}
                                        label="Contactar / Ver Más"
                                        fullWidth
                                    />
                                )}
                            </div>

                            {/* Mini Map Preview */}
                            {hasLocation && (
                                <div className="mt-6 rounded-lg overflow-hidden border border-border h-40 relative group">
                                    <iframe
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${place.lng! - 0.005},${place.lat! - 0.003},${place.lng! + 0.005},${place.lat! + 0.003}&layer=mapnik&marker=${place.lat},${place.lng}`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        title={`Mapa de ${place.business_name}`}
                                        className="opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                            Ver Mapa Completo
                                        </span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Bar (Fixed) */}
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-background/80 backdrop-blur-xl border-t border-border md:hidden z-50 flex gap-3">
                {googleMapsUrl && (
                    <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                        <Button variant="secondary" className="w-full h-12 rounded-xl text-foreground font-medium bg-secondary/80">
                            <Navigation className="mr-2 h-5 w-5" />
                            Ir
                        </Button>
                    </a>
                )}
                {place.phone ? (
                    <a href={whatsappLink || '#'} target="_blank" rel="noopener noreferrer" className="flex-[2]">
                        <Button className="w-full h-12 rounded-xl text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg">
                            <Phone className="mr-2 h-5 w-5" />
                            WhatsApp
                        </Button>
                    </a>
                ) : (
                    place.redirect_url && (
                        <div className="flex-[2]">
                            <ContactButton
                                adId={place.id}
                                url={place.redirect_url}
                                fullWidth
                                className="h-12 rounded-xl"
                            />
                        </div>
                    )
                )}
            </div>

        </div>
    );
}
