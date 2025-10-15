import type { CategoryFilter } from '@/types/servicePageUtilTypes';

interface CategoryFiltersProps {
  filters: CategoryFilter[];
  activeKey: string | null;
  onSelect: (key: string | null) => void;
  isLoading: boolean;
}

export const CategoryFilters = ({ filters, activeKey, onSelect, isLoading }: CategoryFiltersProps) => (
  <section className="bg-white py-10">
    <div className="container-cs space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-brand-500/80">Service Catalogue</p>
        <h2 className="text-3xl font-bold text-indigo-950">Explore services by category</h2>
        <p className="text-sm text-slate-600">
          Choose a category to filter the catalogue. We only show curated categories that are actively offered in your city.
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={`rounded-full border px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            activeKey === null
              ? 'border-brand-500 bg-brand-500 text-white shadow-[0_10px_20px_rgba(2,150,228,0.25)] focus-visible:outline-brand-500'
              : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-500 focus-visible:outline-brand-200'
          }`}
          onClick={() => onSelect(null)}
        >
          All
        </button>
        {filters.map((filter) => {
          const isActive = activeKey === filter.key;
          return (
            <button
              key={filter.key}
              type="button"
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                isActive
                  ? 'border-brand-500 bg-brand-500 text-white shadow-[0_10px_20px_rgba(2,150,228,0.25)] focus-visible:outline-brand-500'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-brand-200 hover:text-brand-500 focus-visible:outline-brand-200'
              }`}
              onClick={() => onSelect(filter.key)}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
      {!isLoading && filters.length === 0 ? (
        <p className="text-sm text-slate-500">Categories will appear here once available.</p>
      ) : null}
    </div>
  </section>
);
