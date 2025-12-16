/**
 * Miramar Experience - Landing Page
 * Main public-facing page with Hero Carousel and Bento Grid
 */

import { Suspense } from 'react';
import { HeroCarousel, BentoGrid, BentoGridEmpty, Navbar, Footer, MapSection } from '@/components/landing';
import { getHeroAds, getGridAds } from '@/lib/data/ads';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch ads server-side SEQUENTIALLY to avoid race condition on cookies()
  const heroAds = await getHeroAds();
  const gridAds = await getGridAds();

  return (
    <>
      <Navbar />

      <main>
        {/* Hero Section with Carousel */}
        <HeroCarousel ads={heroAds} />

        {/* Bento Grid with Featured & Standard Ads */}
        {gridAds.length > 0 ? (
          <BentoGrid ads={gridAds} showCTA={true} />
        ) : (
          <BentoGridEmpty />
        )}

        {/* Map Section - TEMPORARILY DISABLED TO ISOLATE ISSUE */}
        {/*
        <Suspense fallback={
          <section className="w-full bg-muted/30 py-20">
            <div className="max-w-[1280px] mx-auto px-4">
              <div className="h-[500px] flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Cargando mapa de Miramar...</p>
              </div>
            </div>
          </section>
        }>
          <MapSection />
        </Suspense>
        */}
      </main>

      <Footer />
    </>
  );
}
