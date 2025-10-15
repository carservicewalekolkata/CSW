import { Link } from 'react-router-dom';

interface ServicesHeroProps {
  title: string;
  description: string;
  badge?: string | null;
}

export const ServicesHero = ({ title, description, badge }: ServicesHeroProps) => (
  <section
    className="relative overflow-hidden bg-cover bg-center"
    style={{ backgroundImage: 'url(/images/backgrounds/banner-bg.jpg)' }}
  >
    <div className="absolute inset-0 bg-indigo-950/75" />
    <div className="container-cs relative z-10 flex flex-col gap-10 py-20 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl space-y-5 text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200/80">Car Service Wale</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        <p className="text-lg text-white/80">{description}</p>
        {badge ? (
          <span className="inline-flex items-center rounded-full bg-white/15 px-4 py-1 text-sm font-semibold text-white">
            Vehicle: {badge}
          </span>
        ) : null}
        <div className="flex flex-wrap items-center gap-4">
          <Link to="/bookings" className="btn-primary bg-brand-500 text-white hover:bg-brand-600">
            Schedule a service
          </Link>
          <Link
            to="/contact"
            className="btn-secondary border-white/50 text-white hover:border-brand-200 hover:text-brand-200"
          >
            Speak to an advisor
          </Link>
        </div>
      </div>
      <img
        src="/images/hero/service-banner.svg"
        alt="Service banner"
        className="relative z-10 mx-auto w-full max-w-md drop-shadow-2xl"
        loading="lazy"
      />
    </div>
  </section>
);
