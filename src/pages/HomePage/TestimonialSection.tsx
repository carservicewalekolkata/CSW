import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { HomeContent } from '@/hooks/useHomeContent';
import clsx from 'clsx';

interface TestimonialSectionProps {
  items: HomeContent['testimonials'];
}

const TestimonialSection = ({ items }: TestimonialSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    update();
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);

    return () => {
      emblaApi.off('select', update);
      emblaApi.off('reInit', update);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const handler = () => emblaApi.reInit();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [emblaApi]);

  return (
    <section className="max-w-none bg-white">
      <div className="overflow-hidden rounded-tl-[220px] bg-indigo-950 text-white shadow-deep max-[1079px]:rounded-none min-[1080px]:ml-auto min-[1080px]:w-[85%] min-[1080px]:pl-10">
        <div className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <header className="max-w-2xl space-y-4">
            <h2 className="text-3xl font-semibold text-white sm:text-4xl">
              Our <span className="text-brand-200">Happy</span> Customers
            </h2>
            <p className="text-base leading-relaxed text-white/70 sm:text-lg">
              What customers are saying about our safety standards and service quality.
            </p>
          </header>

          <div className="mt-12 flex flex-col gap-12 min-[1080px]:grid min-[1080px]:grid-cols-[minmax(0,1fr)_auto] min-[1080px]:items-center">
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {items.map((item) => (
                  <article
                    key={item.name}
                    className="flex w-full flex-[0_0_100%] flex-col gap-8 px-1 sm:px-2 md:px-4 min-[1080px]:flex-row min-[1080px]:items-center min-[1080px]:gap-14"
                  >
                    <div className="flex justify-center min-[1080px]:justify-start">
                      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-white/10 bg-white/10 sm:h-32 sm:w-32">
                        <img
                          src="/images/icons/testimonials/t-u-image.svg"
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-5 text-left text-white max-[559px]:items-center max-[559px]:text-center min-[1080px]:gap-6">
                      <div className="space-y-3">
                        <p className="text-sm font-medium uppercase tracking-[0.35em] text-brand-200/80">Testimonial</p>
                        <h3 className="text-2xl font-semibold sm:text-3xl">{item.headline}</h3>
                      </div>
                      <p className="text-base leading-relaxed text-white/80 sm:text-lg">{item.message}</p>
                      <div className="text-sm font-semibold text-white">
                        <p>{item.name}</p>
                        <p className="text-sm font-medium text-white/60">{item.role}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center gap-3 max-[1080px]:flex-row max-[1080px]:justify-center">
              {scrollSnaps.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => scrollTo(index)}
                  className={clsx(
                    'h-3 w-3 rounded-full border border-white/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80',
                    selectedIndex === index
                      ? 'h-4 w-4 border-brand-400 bg-brand-400 shadow-[0_0_0_4px_rgba(255,255,255,0.15)]'
                      : 'hover:border-white/70 hover:bg-white/30'
                  )}
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-pressed={selectedIndex === index}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
