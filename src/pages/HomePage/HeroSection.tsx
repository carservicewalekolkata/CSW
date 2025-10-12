import { ChangeEvent, FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState, memo } from 'react';
import { gsap } from 'gsap';
import { useAppStore } from '@/store/appStore';
import type { HomeContent } from '@/hooks/useHomeContent';

interface HeroSectionProps {
  data: HomeContent['hero'];
}

interface AccentFormFieldProps {
  label: string;
  type: 'text' | 'tel';
  value: string;
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const AccentFormField = memo(({ label, type, value, placeholder, onChange }: AccentFormFieldProps) => (
  <label className="block text-sm text-[#2a1454]">
    <span className="flex items-center gap-3 font-semibold">
      <span className="inline-flex h-2 w-2 rounded-full bg-[#EA4A95]" />
      {label}
      <span className="h-px flex-1 bg-[#C2CCE2]" />
    </span>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-3 w-full rounded-xl border border-[#00AEEF] bg-white px-4 py-2.5 text-sm text-[#2a1454] placeholder:text-[#9aa6c2] focus:border-[#0285CE] focus:outline-none focus:ring-4 focus:ring-[#D6F0FF]"
    />
  </label>
));
AccentFormField.displayName = 'AccentFormField';

const HeroSection = ({ data }: HeroSectionProps) => {
  const { currentCity } = useAppStore();

  const [brand, setBrand] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const slidesRef = useRef<HTMLDivElement[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const heroSlides = useMemo(
    () =>
      Array.from({ length: 3 }, (_, i) => ({
        image: '/images/hero/banner-image.svg',
        alt: `Car repair service illustration ${i + 1}`,
      })),
    []
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!brand || !phone) {
      setMessage('Please share your car brand and contact number so we can call back.');
      return;
    }
    setMessage('Thanks! Our service advisor will call you within 15 minutes.');
    setBrand('');
    setPhone('');
  };

  // Animate form on mount
  useLayoutEffect(() => {
    if (!formRef.current) return;
    const t = gsap.fromTo(
      formRef.current,
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }
    );
    return () => {
      t.kill();
    };
  }, []);

  // Core autoplay logic (unchanged)
  useEffect(() => {
    const slides = slidesRef.current;
    const texts = textRef.current
      ? Array.from(textRef.current.querySelectorAll<HTMLElement>('[data-hero-text]'))
      : [];

    slides.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, x: 0 }));
    gsap.set(texts, { y: 40, autoAlpha: 0 });
    gsap.to(texts, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' });

    const playSlide = (index: number) => {
      slides.forEach((el, i) => {
        if (!el) return;
        if (i === index) {
          gsap.set(el, { autoAlpha: 1, x: -90 });
          gsap.to(el, { x: 0, duration: 1.05, ease: 'elastic.out(1, 0.6)' });
        } else {
          gsap.set(el, { autoAlpha: 0, x: -90 });
        }
      });

      gsap.set(texts, { y: 40, autoAlpha: 0 });
      gsap.to(texts, {
        y: 0,
        autoAlpha: 1,
        stagger: 0.12,
        duration: 0.7,
        delay: 0.3,
        ease: 'power2.out',
      });
    };

    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % heroSlides.length;
        playSlide(next);
        return next;
      });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [heroSlides.length]);

  const [beforeCity, afterCity] = data.subheadline.includes(currentCity.name)
    ? data.subheadline.split(currentCity.name)
    : [data.subheadline, ''];

  return (
    <section className="relative isolate overflow-hidden bg-[#E6F5FF]">
      <div className="absolute inset-0 opacity-70">
        <div className="h-full w-full bg-[url('/images/backgrounds/banner-bg.jpg')] bg-cover bg-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-sky-100/80" />

      <div className="container-cs relative z-10 py-20">
        <div className="grid items-center gap-16 lg:grid-cols-[1.3fr_0.9fr]">
          {/* Left Section */}
          <div className="relative lg:pl-20">
            {/* Illustration */}
            <div className="relative mx-auto w-full max-w-[500px] h-[340px] flex items-center justify-center">
              {heroSlides.map((item, i) => (
                <div
                  key={i}
                  ref={(el) => el && (slidesRef.current[i] = el)}
                  className="absolute inset-0 flex justify-center items-center will-change-transform"
                >
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="relative z-10 w-[90%] h-auto max-w-[460px]"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Text */}
            <div ref={textRef} className="mt-8 flex flex-col gap-5 text-[#30155B]">
              <span data-hero-text className="text-lg font-semibold uppercase tracking-[0.45em] text-[#1e51a3]">
                24/7
              </span>
              <h1 data-hero-text className="text-3xl sm:text-4xl font-semibold leading-snug text-[#2d1557]">
                On spot Car &amp; Bike Mechanic
                <span className="block font-extrabold text-[#2d1557]">Repair Service</span>
              </h1>
              <p data-hero-text className="max-w-md text-base text-[#6c74a0]">
                {data.description}
              </p>
              <div data-hero-text className="mt-4 flex items-center gap-3">
                {heroSlides.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2.5 w-2.5 rounded-full transition ${
                      activeIndex === i ? 'bg-[#1e51a3] scale-125' : 'bg-sky-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="flex justify-center lg:justify-end">
            <div
              ref={formRef}
              className="w-full max-w-[400px] rounded-2xl bg-white p-8 text-[#2a1454] shadow-[0_50px_120px_rgba(26,107,199,0.18)] ring-1 ring-white/80"
            >
              <h2 className="text-2xl font-light leading-snug text-[#2a1454]">
                {beforeCity}
                {data.subheadline.includes(currentCity.name) && (
                  <span className="text-[#00AEEF] font-extrabold">{currentCity.name}</span>
                )}
                {afterCity}
              </h2>
              <p className="mt-2 text-sm text-[#6c74a0]">
                Get instant quotes for your car service
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <AccentFormField
                  label="Select Brand"
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Choose your car brand"
                />
                <AccentFormField
                  label="Enter Mobile Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter mobile number"
                />
                <button
                  type="submit"
                  className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#00AEEF] px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_15px_30px_rgba(2,150,228,0.35)] transition hover:bg-[#0285CE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0285CE]"
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
