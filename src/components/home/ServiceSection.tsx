import { useState } from 'react';
import type { HomeContent } from '@/hooks/useHomeContent';
import { Link } from 'react-router-dom';

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
  const services = data[activeTab];

  return (
    <section className="bg-slate-50 py-20">
      <div className="container-cs space-y-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Our Services</p>
            <h2 className="mt-2 text-3xl font-bold text-indigo-950">Book our custom services</h2>
            <p className="mt-3 text-slate-600">
              From periodic maintenance to specialised repair jobs, pick the package that fits your vehicle and schedule.
            </p>
          </div>
          <div className="flex rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2 transition ${
                  activeTab === tab.id ? 'bg-brand-600 text-white shadow-card' : 'text-slate-500 hover:text-indigo-950'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => (
            <div key={service.name} className="group h-full rounded-3xl border border-slate-200 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-deep">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50">
                <img src={service.icon} alt={service.name} className="h-10 w-10" loading="lazy" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-indigo-950">{service.name}</h3>
              <p className="mt-2 text-sm text-slate-600">
                Certified mechanics. Genuine spares. Turnaround within 24 hours depending on the job.
              </p>
              <Link
                to={service.href}
                className="mt-6 inline-flex items-center text-sm font-semibold text-brand-600 transition group-hover:text-brand-700"
              >
                Read more
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="ml-1 h-4 w-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
