import type { HomeContent } from '@/hooks/useHomeContent';

interface CostComparisonSectionProps {
  data: HomeContent['costComparisons'];
}

const variantClasses: Record<HomeContent['costComparisons'][number]['variant'], string> = {
  baseline: 'bg-white text-indigo-950',
  muted: 'bg-brand-50 text-indigo-950',
  highlight: 'bg-indigo-950 text-white shadow-deep'
};

const CostComparisonSection = ({ data }: CostComparisonSectionProps) => {
  return (
    <section className="relative overflow-hidden py-20" style={{ backgroundImage: 'url(/images/comparability-bg.jpg)' }}>
      <div className="absolute inset-0 bg-indigo-950/85" />
      <div className="container-cs relative z-10 space-y-10 text-white">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold">Cost Comparability</h2>
          <p className="mt-3 text-white/80">
            Understand the price advantage of Car Service Wale compared with authorised and local service centres for
            popular models.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {data.map((column) => (
            <div
              key={column.title}
              className={`rounded-3xl border border-white/10 p-6 transition hover:-translate-y-1 ${variantClasses[column.variant]}`}
            >
              <h3 className="text-lg font-semibold leading-snug">{column.title}</h3>
              <ul className="mt-6 space-y-3 text-sm">
                {column.rows.map((row) => (
                  <li key={row.model} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                    <span>{row.model}</span>
                    <span className="font-semibold">₹{row.price.toLocaleString('en-IN')}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CostComparisonSection;
