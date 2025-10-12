import clsx from 'clsx';
import type { City } from '@/store/appStore';
import { getCityVisual } from './cityVisuals';

type CityOptionProps = {
  city: City;
  isCurrent: boolean;
  onSelect: (slug: City['slug']) => void;
};

const CityOption = ({ city, isCurrent, onSelect }: CityOptionProps) => {
  const visual = getCityVisual(city.slug);
  const isAvailable = city.status === 'active';

  return (
    <button
      type="button"
      onClick={() => isAvailable && onSelect(city.slug)}
      disabled={!isAvailable}
      className={clsx(
        'group flex w-full flex-col items-center gap-3 rounded-2xl border border-transparent p-4 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2',
        isAvailable ? 'hover:border-sky-200 hover:bg-sky-50/60' : 'cursor-not-allowed opacity-70',
        isCurrent && 'border-sky-300 bg-sky-50/80 shadow-sm'
      )}
    >
      <span className="relative block h-24 w-24 overflow-hidden rounded-full shadow-md ring-4 ring-white transition group-hover:scale-105 group-disabled:group-hover:scale-100">
        <span
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${visual.image})` }}
        />
        <span
          className={clsx(
            'absolute inset-0 bg-gradient-to-br',
            isAvailable ? 'from-transparent via-transparent to-slate-900/10' : visual.accent
          )}
        />
        {!isAvailable && (
          <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold uppercase tracking-widest text-white">
            Coming soon
          </span>
        )}
        {isCurrent && isAvailable && (
          <span className="absolute -right-1 -bottom-1 rounded-full bg-sky-500 px-2 py-0.5 text-[11px] font-semibold uppercase text-white shadow">
            Active
          </span>
        )}
      </span>
      <span className={clsx('text-sm font-semibold', isAvailable ? 'text-indigo-950' : 'text-slate-500')}>
        {city.name}
      </span>
    </button>
  );
};

export default CityOption;
