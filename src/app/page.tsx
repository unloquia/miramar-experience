/**
 * Miramar Experience - Landing Page
 * Main public-facing page with Hero Carousel and Bento Grid
 */

import { Suspense } from 'react';
import { HeroCarousel, BentoGrid, BentoGridEmpty, Navbar, Footer, MapSection } from '@/components/landing';
// TEMPORARILY DISABLED FOR DEBUGGING
// import { getHeroAds, getGridAds } from '@/lib/data/ads';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // TEMPORARILY DISABLED FOR DEBUGGING - using empty arrays
  // const [heroAds, gridAds] = await Promise.all([
  //   getHeroAds(),
  //   getGridAds(),
  // ]);
  const heroAds: any[] = [];
  const gridAds: any[] = [];

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

        {/* Map Section - TEMPORARILY DISABLED FOR DEBUGGING */}
        <div className="w-full h-[200px] flex items-center justify-center bg-muted/20 my-10">
          <p className="text-muted-foreground">Mapa deshabilitado temporalmente para diagnóstico</p>
        </div>
        {/* Original MapSection:
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
        */}
      </main>

      <Footer />
    </>
  );
}
