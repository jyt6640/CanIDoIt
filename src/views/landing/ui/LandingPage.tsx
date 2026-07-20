import { Hero } from '@/widgets/hero';
import { Footer } from '@/widgets/footer';
import type { DestinationCountry } from '@/entities/destination';

interface LandingPageProps {
  countries: DestinationCountry[];
}

export const LandingPage = ({ countries }: LandingPageProps) => (
  <div className="relative min-h-screen bg-light-bg font-noto text-black selection:bg-[#5ae14c]/30">
    <Hero countries={countries} />
    <Footer />
  </div>
);
