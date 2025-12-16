/**
 * BentoGrid Component
 * Displays featured and standard ads in a responsive grid
 * 
 * Logic:
 * - Featured: col-span-2 (takes 2 columns)
 * - Standard: col-span-1 (takes 1 column)
 */

import { Ad } from '@/types/database';
import { AdCard, CTACard } from './AdCard';

interface BentoGridProps {
    ads: Ad[];
    showCTA?: boolean;
}

export function BentoGrid({ ads, showCTA = true }: BentoGridProps) {
    // Separate featured and standard ads
    const featuredAds = ads.filter(ad => ad.tier === 'featured');
    const standardAds = ads.filter(ad => ad.tier === 'standard');

    // Interleave ads for visual balance
    // Pattern: featured, standard, standard, featured, standard, ...
    const arrangedAds = arrangeAds(featuredAds, standardAds);

    return (
        <section className="relative flex flex-col w-full bg-background py-20">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
                    <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">

                        {/* Section Header */}
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                            <div className="flex flex-col gap-3">
                                <span className="text-primary font-bold tracking-wider uppercase text-sm">
                                    Experiencias Exclusivas
                                </span>
                                <h2 className="text-foreground text-4xl md:text-5xl font-bold leading-tight tracking-[-0.02em]">
                                    Destacados de la Ciudad
                                </h2>
                                <p className="text-muted-foreground text-lg max-w-xl">
                                    Una selección curada de los mejores comercios, hoteles y actividades que Miramar tiene para ofrecer.
                                </p>
                            </div>
                            <button className="hidden md:flex items-center gap-2 text-foreground font-semibold hover:text-primary transition-colors group">
                                Ver todos los comercios
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                                    arrow_forward
                                </span>
                            </button>
                        </div>

                        {/* Bento Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[320px] gap-6">
                            {arrangedAds.map((ad) => (
                                <div
                                    key={ad.id}
                                    className={`h-full ${ad.tier === 'featured' ? 'md:col-span-2 md:row-span-2' : 'col-span-1'}`}
                                >
                                    <AdCard ad={ad} />
                                </div>
                            ))}

                            {/* CTA Card - Always at the end if enabled */}
                            {showCTA && <CTACard />}
                        </div>

                        {/* Mobile "Ver todos" button */}
                        <div className="mt-8 md:hidden flex justify-center">
                            <button className="w-full py-4 border border-border rounded-xl text-foreground font-bold hover:bg-muted transition-colors flex items-center justify-center gap-2">
                                Ver todos los comercios
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

/**
 * Arrange ads for visual balance in the grid
 * Places featured ads strategically among standard ads
 */
function arrangeAds(featured: Ad[], standard: Ad[]): Ad[] {
    const result: Ad[] = [];
    let featuredIndex = 0;
    let standardIndex = 0;

    // Pattern: 1 Featured -> up to 2 Standard -> Repeat
    while (featuredIndex < featured.length || standardIndex < standard.length) {

        // Always try to place a featured ad first in the cycle
        if (featuredIndex < featured.length) {
            result.push(featured[featuredIndex]);
            featuredIndex++;
        }

        // Then place up to 2 standard ads
        for (let i = 0; i < 2 && standardIndex < standard.length; i++) {
            result.push(standard[standardIndex]);
            standardIndex++;
        }

        // SAFETY BREAK: If we happen to have logic that prevents progress, break
        // (Though the logic above guarantees progress if checks pass)
    }

    return result;
}

// Empty state when no ads
export function BentoGridEmpty() {
    return (
        <section className="relative flex flex-col w-full bg-background py-20">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center">
                    <div className="layout-content-container flex flex-col max-w-[1280px] flex-1">

                        {/* Section Header */}
                        <div className="flex flex-col gap-3 mb-12 text-center">
                            <span className="text-primary font-bold tracking-wider uppercase text-sm">
                                Experiencias Exclusivas
                            </span>
                            <h2 className="text-foreground text-4xl md:text-5xl font-bold leading-tight tracking-[-0.02em]">
                                Destacados de la Ciudad
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                                Próximamente encontrarás aquí los mejores comercios de Miramar.
                            </p>
                        </div>

                        {/* Single CTA Card */}
                        <div className="max-w-md mx-auto w-full h-[320px]">
                            <CTACard />
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
