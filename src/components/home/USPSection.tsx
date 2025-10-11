import type { HomeContent } from '@/hooks/useHomeContent';

interface USPSectionProps {
  items: HomeContent['usp'];
}

const USPSection = ({ items }: USPSectionProps) => {
  return (
    <section className="bg-white py-16">
      <div className="container-cs">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="card-surface flex items-start gap-4 p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50">
                <img src={item.icon} alt="USP" className="h-8 w-8" loading="lazy" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-indigo-950">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default USPSection;
