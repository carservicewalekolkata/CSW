import type { HomeContent } from '@/hooks/useHomeContent';

interface WhyUsSectionProps {
  items: HomeContent['whyUs'];
}

const WhyUsSection = ({ items }: WhyUsSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-white py-24">
      {/* <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#E7F4FF] via-white to-[#F6EEFF]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[url('/images/backgrounds/doot.svg')] bg-cover bg-center opacity-35"
          aria-hidden
        />
        <div
          className="absolute -left-32 top-1/2 hidden h-[680px] w-[680px] -translate-y-1/2 rounded-full bg-[#E4F3FF] blur-[140px] opacity-90 lg:block"
          aria-hidden
        />
        <div
          className="absolute -right-32 top-10 hidden h-[560px] w-[560px] rounded-full bg-[#F3E9FF] blur-[160px] opacity-80 lg:block"
          aria-hidden
        />
      </div> */}

      <div className="container-cs relative z-10 grid gap-12 lg:grid-cols-[minmax(0,640px)_minmax(0,520px)] lg:items-start lg:gap-20">
        <div className="order-2 flex justify-center lg:order-1 mt-5 lg:justify-start">
          <div className="relative flex w-full max-w-[840px] justify-center lg:justify-start">
            <span
              className="absolute -left-8 top-1/2 h-[340px] w-[340px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,#BFE6FF_0%,rgba(191,230,255,0)_70%)] blur-[30px] opacity-80"
              aria-hidden
            />
            <img
              src="/images/backgrounds/hero/car-image.svg"
              alt="Vehicle parts and car"
              className="relative z-10 w-full"
              loading="lazy"
            />
          </div>
        </div>

        <div className="order-1 flex flex-col gap-8 lg:order-2">
          <div className="space-y-4 text-left">
            <h2 className="text-[24px] font-bold leading-tight text-[#2D1557] md:text-[32px]">
              Why Car Service Wale <span className="text-[#00A0E3] block">In Kolkata</span>
            </h2>
            <p className="text-sm text-[#5F6285] md:text-base">
              We&apos;ve got you covered wherever you go across the country!
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {items.map((item, index) => (
              <div
                key={item.title}
                className={`
                  flex w-full
                  ${index === 0 ? 'justify-center' : ''}
                  ${index === 1 ? 'justify-start' : ''}
                  ${index === 2 ? 'justify-end' : ''}
                `}
              >
                <div
                  className="group relative grid h-[90px] w-[80%] grid-cols-[auto_1fr] items-center gap-10 overflow-hidden rounded-lg border border-white/20 bg-white px-8 shadow-[0_40px_80px_rgba(8,29,73,0.18)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_50px_110px_rgba(8,29,73,0.22)] md:gap-8 md:px-5"
                >
                  <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-[24px] bg-brand-900 text-white">
                    <img src={item.icon} alt={item.title} className="h-12 w-12 object-contain z-10" loading="lazy" />
                    <div className="absolute h-32 w-32 rounded-full bg-brand-900 top-1/2 -translate-y-1/2 -left-14 z-0"></div>
                  </div>
                  <div className="relative z-10 flex-1">
                    <h3 className="text-xs font-semibold text-[#0098DC] md:text-sm">{item.title}</h3>
                    <p className="text-[10px] leading-relaxed text-[#5E6287] md:text-xs">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>


          <a
            href="/about"
            className="group mt-4 inline-flex items-center gap-2 text-base font-semibold text-[#0098DC] transition hover:text-[#007bb0]"
          >
            Learn More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
