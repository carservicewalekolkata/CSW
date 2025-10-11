import { useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { HomeContent } from '@/hooks/useHomeContent';

interface TestimonialSectionProps {
  items: HomeContent['testimonials'];
}

const TestimonialSection = ({ items }: TestimonialSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  useEffect(() => {
    if (!emblaApi) return;
    const handler = () => emblaApi.reInit();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [emblaApi]);

  return (
    <section className="bg-slate-50 py-20">
      <div className="container-cs space-y-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-indigo-950">Our Happy Customers</h2>
          <p className="mt-3 text-slate-600">What customers are saying about our safety standards and service quality.</p>
        </div>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {items.map((item) => (
              <div key={item.name} className="min-w-0 flex-[0_0_100%] px-2 md:flex-[0_0_50%]">
                <div className="card-surface h-full rounded-3xl bg-white p-8">
                  <div className="flex items-start gap-6">
                    <img
                      src="/images/t-u-image.svg"
                      alt={item.name}
                      className="h-20 w-20 flex-shrink-0 rounded-full border border-slate-100 bg-brand-50"
                      loading="lazy"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-indigo-950">{item.headline}</h3>
                      <p className="mt-3 text-sm text-slate-600">{item.message}</p>
                      <div className="mt-6 text-sm font-semibold text-indigo-950">
                        <p>{item.name}</p>
                        <p className="text-sm font-medium text-slate-500">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
