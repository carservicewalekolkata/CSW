
import type { HomeContent } from '@/hooks/useHomeContent';
import HeroCarousel from './HeroCarousel';
import HeroForm from './HeroForm';

interface HeroSectionProps {
  data: HomeContent['hero'];
}

const HeroSection = ({ data }: HeroSectionProps) => {
  
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-[url('/images/backgrounds/banner-bg.jpg')] bg-cover bg-center bg-no-repeat" />
      </div>

      <div className="container-cs relative z-10 pt-36 pb-20">
        <div className="grid items-start gap-16 lg:grid-cols-[1.3fr_0.9fr]">
          <HeroCarousel data={data} />

          <HeroForm data={data} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
