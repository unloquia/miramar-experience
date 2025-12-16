/**
 * AdCard Component
 * Card for displaying ads in the Bento Grid
 * 
 * Variants:
 * - Featured: Large card with premium badge, col-span-2
 * - Standard: Regular card, col-span-1
 */

import { Ad } from '@/types/database';
import { categoryInfo } from '@/lib/schemas';
import { ExternalLink, Star } from 'lucide-react';

interface AdCardProps {
    ad: Ad;
}

export function AdCard({ ad }: AdCardProps) {
    const isFeatured = ad.tier === 'featured';
    const category = categoryInfo[ad.category];

    if (isFeatured) {
        return <FeaturedCard ad={ad} category={category} />;
    }

    return <StandardCard ad={ad} category={category} />;
}

// Featured Card - Larger with more details
function FeaturedCard({ ad, category }: { ad: Ad; category: typeof categoryInfo[keyof typeof categoryInfo] }) {
    return (
        <a href={`/place/${ad.id}`} className="block group relative h-full md:col-span-2 md:row-span-2 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.01] transition-all duration-500 cursor-pointer">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${ad.image_url}')` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

            {/* Premium Badge */}
            <div className="absolute top-6 right-6">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    Premium
                </span>
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col items-start gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <div className="glass-card-info p-6 rounded-xl w-full flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-primary text-sm font-bold uppercase tracking-wide mb-1">
                                {category.label}
                            </p>
                            <h3 className="text-white text-2xl md:text-3xl font-bold">
                                {ad.business_name}
                            </h3>
                        </div>
                    </div>

                    {ad.description && (
                        <p className="text-white/80 text-base line-clamp-2 mt-2">
                            {ad.description}
                        </p>
                    )}

                    {/* CTA Button - Appears on hover */}
                    <div className="h-0 group-hover:h-12 opacity-0 group-hover:opacity-100 overflow-hidden transition-all duration-500 ease-in-out mt-0 group-hover:mt-4">
                        <div className="w-full h-12 bg-primary hover:bg-[#0fd6d6] text-primary-foreground font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
                            <span>Ver detalles</span>
                            <ExternalLink className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}

// Standard Card - Regular size
function StandardCard({ ad, category }: { ad: Ad; category: typeof categoryInfo[keyof typeof categoryInfo] }) {
    return (
        <a
            href={`/place/${ad.id}`}
            className="group relative h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 cursor-pointer block"
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url('${ad.image_url}')` }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            {/* Content */}
            <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    {ad.business_name}
                </h3>
                <p className="text-white/70 text-sm">{category.label}</p>
            </div>

            {/* Arrow Button */}
            <button className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-primary hover:text-primary-foreground transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_outward</span>
            </button>
        </a>
    );
}

// CTA Card - For "Publicita Aquí" promotion
export function CTACard() {
    return (
        <div className="group relative h-full rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 cursor-pointer bg-sand-accent dark:bg-muted">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 gap-4">
                <div className="size-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-2">
                    <span className="material-symbols-outlined text-3xl">storefront</span>
                </div>
                <h3 className="text-foreground text-xl font-bold">¿Tienes un negocio?</h3>
                <p className="text-muted-foreground text-sm">
                    Únete a Miramar Experience y llega a miles de turistas.
                </p>
                <button className="mt-2 px-6 py-2 bg-foreground text-background font-bold rounded-lg hover:opacity-80 transition-colors">
                    Publicita Aquí
                </button>
            </div>
        </div>
    );
}
