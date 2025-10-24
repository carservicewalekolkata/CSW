import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { FaGear } from 'react-icons/fa6';
import type { HomeContent } from '@/hooks/useHomeContent';

interface ServiceSectionProps {
  data: HomeContent['services'];
}

const tabs = [
  { id: 'primary', label: 'Our Services' },
  { id: 'custom', label: 'Custom Services' }
] as const;

type TabId = (typeof tabs)[number]['id'];

const ServiceSection = ({ data }: ServiceSectionProps) => {
  const [activeTab, setActiveTab] = useState<TabId>('primary');
  const services = useMemo(() => data[activeTab] ?? [], [data, activeTab]);
  const hasServices = services.length > 0;
  useEffect(() => {
    const hasPrimary = (data.primary ?? []).length > 0;
    const hasCustom = (data.custom ?? []).length > 0;

    if (!hasPrimary && hasCustom && activeTab === 'primary') {
      setActiveTab('custom');
    } else if (hasPrimary && !hasCustom && activeTab === 'custom') {
      setActiveTab('primary');
    }
  }, [data, activeTab]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', containScroll: 'trimSnaps' });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !hasServices) {
      setCanScrollPrev(false);
      setCanScrollNext(false);
      return;
    }
    updateScrollState();
    emblaApi.on('select', updateScrollState);
    emblaApi.on('reInit', updateScrollState);

    const handleResize = () => emblaApi.reInit();
    window.addEventListener('resize', handleResize);

    return () => {
      emblaApi.off('select', updateScrollState);
      emblaApi.off('reInit', updateScrollState);
      window.removeEventListener('resize', handleResize);
    };
  }, [emblaApi, hasServices, updateScrollState]);
  useEffect(() => {
    if (!emblaApi || !hasServices) {
      return;
    }
    emblaApi.reInit();
    emblaApi.scrollTo(0);
    updateScrollState();
  }, [emblaApi, hasServices, services, updateScrollState]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F6FAFF] via-[#F1F7FF] to-[#F7FBFF] pb-24">
      <span className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#D7ECFF] opacity-60 blur-3xl" aria-hidden />
      <div className="container-cs relative">
        <div className="flex flex-col items-stretch gap-12 max-[1080px]:gap-10 lg:flex-row lg:items-center">
          <div className="relative hidden justify-center md:flex md:w-[320px] md:flex-none lg:w-[360px] xl:w-[420px]">
            <div className="relative w-full max-w-[420px]">
              <span className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#E5F3FF] blur-2xl" aria-hidden />
              <div className="overflow-hidden rounded-[48px] shadow-[0_30px_90px_rgba(0,174,236,0.18)]">
                <img
                  src="/images/hero/service-image.jpg"
                  alt="Technician servicing a car engine"
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-12 left-1/2 hidden h-32 w-32 -translate-x-1/2 transform items-center justify-center rounded-full bg-brand-600 text-center text-white shadow-[0_25px_60px_rgba(0,174,236,0.25)] md:flex">
                <div className="px-3">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-brand-100">Over</p>
                  <p className="text-2xl font-bold leading-tight">10</p>
                  <p className="text-xs leading-tight">years of experience</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-hidden space-y-10">
            <div className="space-y-2 text-indigo-950">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-600">Our service</p>
              <div className="space-y-3">
                <h2 className="text-2xl font-semibold leading-tight md:text-[32px] md:leading-[1.15]">Book our custom services</h2>
                <p className="max-w-2xl text-base text-slate-600">
                  From periodic maintenance to specialised repair jobs, pick the package that fits your vehicle and schedule.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2 text-base font-semibold">
                <div className="flex flex-wrap items-center gap-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative pb-2 transition-colors ${
                        activeTab === tab.id
                          ? "text-indigo-950 after:absolute after:-bottom-px after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-brand-600 after:content-['']"
                          : 'text-slate-400 hover:text-brand-600'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={scrollPrev}
                    disabled={!hasServices || !canScrollPrev}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 transition hover:border-brand-200 hover:bg-brand-50 ${
                      !canScrollPrev ? 'cursor-not-allowed opacity-40 hover:bg-white' : ''
                    }`}
                    aria-label="View previous services"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={scrollNext}
                    disabled={!hasServices || !canScrollNext}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-600 transition hover:border-brand-200 hover:bg-brand-50 ${
                      !canScrollNext ? 'cursor-not-allowed opacity-40 hover:bg-white' : ''
                    }`}
                    aria-label="View next services"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              {hasServices ? (
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex gap-6 max-[500px]:gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="group relative flex min-w-[360px] h-[280px] flex-[0_0_90%] flex-col rounded-[32px] border border-transparent bg-white p-6 text-left transition hover:-translate-y-1 hover:border-brand-100 sm:flex-[0_0_60%] md:flex-[0_0_50%] lg:flex-[0_0_40%] xl:flex-[0_0_28%] max-[500px]:mx-auto max-[500px]:flex-[0_0_100%]"
                      >
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F6FAFF] to-[#E7F4FF] text-brand-600 shadow-inner">
                          <FaGear className="h-8 w-8" aria-hidden />
                        </div>
                        <h3 className="mt-5 text-lg font-semibold leading-snug text-indigo-950">{service.name}</h3>
                        <p className="mt-3 text-sm text-slate-600">{service.description}</p>
                        <Link
                          to={service.href}
                          state={{ selectedCategoryId: service.id }}
                          className="mt-8 inline-flex items-center text-sm font-semibold text-brand-600 transition group-hover:text-brand-700"
                        >
                          Read more
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                          </svg>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-brand-200 bg-white/70 p-12 text-center">
                  <FaGear className="h-12 w-12 text-brand-400" aria-hidden />
                  <p className="mt-4 text-base font-semibold text-indigo-950">No categories available yet</p>
                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    We are curating services for this category. Check back soon or call our support team for assistance.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
