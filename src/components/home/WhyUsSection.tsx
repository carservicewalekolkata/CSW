import type { HomeContent } from '@/hooks/useHomeContent';

interface WhyUsSectionProps {
  items: HomeContent['whyUs'];
}

const WhyUsSection = ({ items }: WhyUsSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="container-cs grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-indigo-950">Why Car Service Wale in Kolkata?</h2>
          <p className="text-slate-600">
            We have you covered across the city with dedicated workshops, vetted partners, and technology-first support.
          </p>
          <div className="grid gap-6">
            {items.map((item) => (
              <div key={item.title} className="card-surface flex items-start gap-4 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
                  <img src={item.icon} alt={item.title} className="h-8 w-8" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-indigo-950">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Learn more
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12l-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
        <div className="relative hidden lg:block">
          <div className="absolute -left-16 top-10 h-80 w-80 rounded-full bg-brand-500/20 blur-3xl" />
          <img src="/images/car-image.svg" alt="Car service" className="relative z-10 w-full" loading="lazy" />
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
