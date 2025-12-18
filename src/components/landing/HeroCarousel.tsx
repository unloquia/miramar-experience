/**
 * HeroCarousel Component
 * Displays hero tier ads in a fullscreen carousel
 * 
 * Edge Cases:
 * - 0 results: Shows fallback image
 * - 1 result: Disables autoplay and navigation arrows
 * - Multiple results: Enables 5s autoplay rotation
 */

'use client';

import { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Ad } from '@/types/database';

interface HeroCarouselProps {
    ads: Ad[];
}

// Fallback image when no hero ads exist
const FALLBACK_IMAGE = '/images/hero-placeholder.jpg';
const FALLBACK_TITLE = 'soydeMiramar: Naturaleza y Paz';
const FALLBACK_SUBTITLE = 'Descubre el secreto mejor guardado de la costa atlántica. Playas extensas, bosques encantados y una gastronomía que despierta tus sentidos.';

export function HeroCarousel({ ads }: HeroCarouselProps) {
    const hasAds = ads.length > 0;
    const hasMultiple = ads.length > 1;

    // Only enable autoplay if there are multiple ads
    const plugins = hasMultiple ? [Autoplay({ delay: 5000, stopOnInteraction: false })] : [];

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: hasMultiple,
            duration: 30,
        },
        plugins
    );

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    // Render single fallback slide when no ads exist
    if (!hasAds) {
        return (
            <section className="relative flex min-h-screen w-full flex-col justify-center items-center overflow-hidden">
                {/* Background with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-background z-10" />
                    <div
                        className="w-full h-full bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url('${FALLBACK_IMAGE}')`,
                            backgroundColor: '#0F172A'
                        }}
                    />
                </div>

                {/* Content */}
                <div className="relative z-20 flex flex-col items-center gap-8 text-center px-4 max-w-4xl mt-16 animate-fade-in-up">
                    <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.1] tracking-[-0.033em] drop-shadow-lg">
                        {FALLBACK_TITLE.split(':')[0]} <br className="hidden md:block" />
                        <span className="text-primary">{FALLBACK_TITLE.split(':')[1]?.trim()}</span>
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed max-w-2xl drop-shadow-md">
                        {FALLBACK_SUBTITLE}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary hover:bg-[#0fd6d6] text-primary-foreground text-base font-bold tracking-wide shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300">
                            <span className="mr-2">Explorar la Ciudad</span>
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/70">
                    <span className="material-symbols-outlined text-4xl">keyboard_arrow_down</span>
                </div>
            </section>
        );
    }

    return (
        <section className="relative min-h-screen w-full overflow-hidden">
            <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container flex h-screen">
                    {ads.map((ad) => (
                        <div
                            key={ad.id}
                            className="embla__slide relative flex-[0_0_100%] min-w-0 flex flex-col justify-center items-center"
                        >
                            {/* Background with Overlay */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-background z-10" />
                                <div
                                    className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700"
                                    style={{ backgroundImage: `url('${ad.image_url}')` }}
                                />
                            </div>

                            {/* Content */}
                            <div className="relative z-20 flex flex-col items-center gap-6 text-center px-4 max-w-4xl mt-16 animate-fade-in-up">
                                <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-[-0.033em] drop-shadow-lg">
                                    {ad.business_name}
                                </h1>
                                {ad.description && (
                                    <p className="text-white/90 text-lg md:text-xl font-normal leading-relaxed max-w-2xl drop-shadow-md">
                                        {ad.description}
                                    </p>
                                )}
                                <a
                                    href={`/place/${ad.id}`}
                                    className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary hover:bg-[#0fd6d6] text-primary-foreground text-base font-bold tracking-wide shadow-lg hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 mt-4"
                                >
                                    <span className="mr-2">Ver más</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows - Only show if multiple slides */}
            {hasMultiple && (
                <>
                    <button
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Siguiente"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/70">
                <span className="material-symbols-outlined text-4xl">keyboard_arrow_down</span>
            </div>

            {/* Dots indicator - Only show if multiple slides */}
            {hasMultiple && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {ads.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => emblaApi?.scrollTo(index)}
                            className={`w-2 h-2 rounded-full transition-all ${emblaApi?.selectedScrollSnap() === index
                                ? 'bg-primary w-6'
                                : 'bg-white/50'
                                }`}
                            aria-label={`Ir a slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
