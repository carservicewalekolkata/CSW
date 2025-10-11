import type { HomeContent } from '@/hooks/useHomeContent';

interface BenefitsSectionProps {
  items: HomeContent['benefits'];
}

const BenefitsSection = ({ items }: BenefitsSectionProps) => {
  return (
    <section className="relative overflow-hidden bg-white py-20">
      <div className="container-cs space-y-10">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-indigo-950">Car Service Wale Benefits</h2>
          <p className="mt-3 text-slate-600">We simplify automotive care with a streamlined, transparent workflow.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.step} className="card-surface flex items-center gap-6 rounded-3xl bg-white p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                {item.step}
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

export default BenefitsSection;
