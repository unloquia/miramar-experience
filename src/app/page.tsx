/**
 * Miramar Experience - Landing Page
 * Main public-facing page with Hero Carousel and Bento Grid
 */

import { HeroCarousel, BentoGrid, BentoGridEmpty, Navbar, Footer, MapSection } from '@/components/landing';
import { getHeroAds, getGridAds } from '@/lib/data/ads';

export default async function HomePage() {
  // Fetch ads server-side (with expiration filter)
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

        {/* Map Section */}
        <MapSection />
      </main>

      <Footer />
    </>
  );
}
