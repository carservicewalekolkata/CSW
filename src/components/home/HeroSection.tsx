import { FormEvent, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useAppStore } from '@/store/appStore';
import type { HomeContent } from '@/hooks/useHomeContent';

interface HeroSectionProps {
  data: HomeContent['hero'];
}

const blobRadius = '58% 42% 52% 48% / 64% 42% 58% 36%';

const HeroSection = ({ data }: HeroSectionProps) => {
  const { currentCity } = useAppStore();
  const [brand, setBrand] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<HTMLDivElement[]>([]);
  const autoplay = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true
    })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [autoplay.current]);

  const heroSlides = Array.from({ length: 3 }, (_, index) => ({
    image: '/images/hero/banner-image.svg',
    alt: `Car repair service illustration ${index + 1}`
  }));

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!brand || !phone) {
      setMessage('Please share your car brand and contact number so we can call back.');
      return;
    }
    setMessage('Thanks! Our service advisor will call you within 15 minutes.');
    setBrand('');
    setPhone('');
  };

  useEffect(() => {
    if (!textRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-hero-text]',
        { y: 36, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power2.out' }
      );
    }, textRef);
    return () => ctx.revert();
  }, [data]);

  useEffect(() => {
    if (!formRef.current) return;
    const tween = gsap.fromTo(
      formRef.current,
      { y: 42, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, delay: 0.2, ease: 'power2.out' }
    );
    return () => tween.kill();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const animateSlide = (index: number) => {
      const slide = slideRefs.current[index];
      if (!slide) return;

      gsap.fromTo(
        slide,
        { x: -90, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'elastic.out(1, 0.7)' }
      );
    };

    const handleSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
      animateSlide(index);
    };

    handleSelect();
    emblaApi.on('select', handleSelect);
    emblaApi.on('reInit', handleSelect);
    return () => {
      emblaApi.off('select', handleSelect);
      emblaApi.off('reInit', handleSelect);
    };
  }, [emblaApi]);

  const [beforeCity, afterCity] = data.subheadline.includes(currentCity.name)
    ? data.subheadline.split(currentCity.name)
    : [data.subheadline, ''];

  const handleDotClick = (index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#E6F5FF]">
      <div className="absolute inset-0 opacity-70">
        <div className="h-full w-full bg-[url('/images/backgrounds/doots2.svg')] bg-cover bg-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-sky-100/80" />
      <div className="container-cs relative z-10 py-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.25fr_0.85fr]">
          <div className="relative lg:pl-20">
            <div className="pointer-events-none absolute -left-16 top-28 hidden flex-col items-center text-[11px] font-semibold uppercase tracking-[0.42em] text-[#1b5195] lg:flex">
              <span className="rotate-180 [writing-mode:vertical-rl]">Scroll Down</span>
              <span className="mt-6 h-24 w-px bg-sky-300" />
              <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-sky-300">
                <span className="h-1.5 w-6 rounded-full bg-sky-400" />
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[560px]">
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#D7EDFF] via-white to-[#BADAFF] shadow-[0_50px_120px_rgba(24,112,197,0.18)]"
                style={{ borderRadius: blobRadius }}
              />
              <div
                className="relative overflow-hidden"
                style={{ borderRadius: blobRadius }}
              >
                <div ref={emblaRef} className="overflow-hidden">
                  <div className="flex">
                    {heroSlides.map((item, index) => (
                      <div
                        key={item.alt}
                        className="min-w-0 flex-[0_0_100%] px-10 py-12"
                        ref={(element) => {
                          if (element) {
                            slideRefs.current[index] = element;
                          }
                        }}
                      >
                        <div className="relative mx-auto max-w-[440px]">
                          <div className="absolute -left-14 -top-14 h-32 w-32 rounded-full bg-sky-100/80 blur-2xl" />
                          <div className="absolute -bottom-16 -right-12 h-36 w-36 rounded-full bg-sky-200/70 blur-3xl" />
                          <img src={item.image} alt={item.alt} className="relative z-10 w-full" loading="lazy" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div ref={textRef} className="mt-12 flex flex-col gap-5 text-[#30155B]">
              <span data-hero-text className="text-lg font-semibold uppercase tracking-[0.45em] text-[#1e51a3]">
                24/7
              </span>
              <h1 data-hero-text className="text-4xl font-semibold leading-tight text-[#2d1557] sm:text-5xl">
                On spot Car &amp; Bike Mechanic
                <span className="block font-extrabold text-[#2d1557]">Repair Service</span>
              </h1>
              <p data-hero-text className="max-w-xl text-base text-[#6c74a0] sm:text-lg">{data.description}</p>
              <div data-hero-text className="mt-6 flex items-center gap-3">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDotClick(index)}
                    className="group relative h-3 w-3 rounded-full bg-sky-200 transition hover:bg-[#1e51a3] data-[active=true]:scale-125 data-[active=true]:bg-[#1e51a3]"
                    data-active={selectedIndex === index}
                    aria-label={`Go to slide ${index + 1}`}
                  >
                    <span className="absolute inset-0 rounded-full ring-4 ring-transparent transition group-data-[active=true]:ring-[#B7D8FF]" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div
              ref={formRef}
              className="w-full max-w-[420px] rounded-[32px] bg-white p-10 text-[#2a1454] shadow-[0_50px_120px_rgba(26,107,199,0.18)] ring-1 ring-white/80"
            >
              <h2 className="text-[28px] font-semibold leading-snug text-[#2a1454]">
                {beforeCity}
                {data.subheadline.includes(currentCity.name) && (
                  <span className="text-[#00AEEF]">{currentCity.name}</span>
                )}
                {afterCity}
              </h2>
              <p className="mt-3 text-sm text-[#6c74a0]">Get instant quotes for your car service</p>
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <label className="space-y-2 text-sm text-[#2a1454]">
                  <span className="font-semibold">Select Brand</span>
                  <input
                    type="text"
                    value={brand}
                    onChange={(event) => setBrand(event.target.value)}
                    placeholder="Choose your car brand"
                    className="w-full rounded-[14px] border-2 border-[#00AEEF] bg-white px-4 py-3 text-base text-[#2a1454] placeholder:text-[#9aa6c2] focus:border-[#0285CE] focus:outline-none focus:ring-4 focus:ring-[#D6F0FF]"
                  />
                </label>
                <label className="space-y-2 text-sm text-[#2a1454]">
                  <span className="font-semibold">Enter Mobile Number</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full rounded-[14px] border-2 border-[#00AEEF] bg-white px-4 py-3 text-base text-[#2a1454] placeholder:text-[#9aa6c2] focus:border-[#0285CE] focus:outline-none focus:ring-4 focus:ring-[#D6F0FF]"
                  />
                </label>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-[14px] bg-[#00AEEF] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_20px_40px_rgba(2,150,228,0.35)] transition hover:bg-[#0285CE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0285CE]"
                >
                  Get A Quotes
                </button>
                {message && <p className="text-sm font-medium text-[#0285CE]">{message}</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
