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
  // Fetch ads server-side
  const [heroAds, gridAds] = await Promise.all([
    getHeroAds(),
    getGridAds(),
  ]);

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

        {/* Map Section - Suspense for streaming */}
        <Suspense fallback={
          <div className="w-full h-[500px] flex items-center justify-center bg-muted/20">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Cargando mapa...</p>
            </div>
          </div>
        }>
          <MapSection />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
