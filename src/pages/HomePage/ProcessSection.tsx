import type { HomeContent } from '@/hooks/useHomeContent';

interface ProcessSectionProps {
  items: HomeContent['process'];
}

const ProcessSection = ({ items }: ProcessSectionProps) => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="container-cs space-y-10">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-indigo-950">How do we do it?</h2>
          <p className="mt-3 text-slate-600">Car servicing in Kolkata is now easier and more convenient than ever before.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div key={item.description} className="card-surface flex flex-col items-center gap-4 rounded-3xl bg-white p-6 text-center">
              <img src={item.icon} alt={`Process step ${index + 1}`} className="h-16 w-16" loading="lazy" />
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
