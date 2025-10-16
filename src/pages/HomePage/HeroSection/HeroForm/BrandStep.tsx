import type { VehicleBrand } from '@/store/vehicleStore';

import LoadingIndicator from './LoadingIndicator';

export interface BrandStepProps {
  brands: VehicleBrand[];
  selectedBrand: VehicleBrand | null;
  isLoadingCatalog: boolean;
  hasLoadedCatalog: boolean;
  catalogError: string | null;
  onRetry: () => void;
  onSelect: (brand: VehicleBrand) => void;
}

const BrandStep = ({
  brands,
  selectedBrand,
  isLoadingCatalog,
  hasLoadedCatalog,
  catalogError,
  onRetry,
  onSelect
}: BrandStepProps) => {
  if (isLoadingCatalog && !hasLoadedCatalog) {
    return <LoadingIndicator />;
  }

  if (catalogError) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        <p>{catalogError}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 text-xs font-semibold text-[#0285CE] underline-offset-2 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (brands.length === 0) {
    return <p className="py-6 text-sm text-[#6c74a0]">No brands found. Please try again later.</p>;
  }

  return (
    <div className="grid max-h-[340px] grid-cols-3 gap-4 overflow-y-auto pr-1 sm:grid-cols-4">
      {brands.map((brand) => {
        const isSelected = selectedBrand?.slug === brand.slug;

        return (
          <button
            key={brand.slug}
            type="button"
            onClick={() => onSelect(brand)}
            className={`flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white p-4 text-center text-[11px] font-semibold uppercase tracking-wide text-[#2a1454] shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
              isSelected ? 'border-[#0285CE] shadow-[0_0_0_3px_rgba(2,133,206,0.12)]' : ''
            }`}
          >
            {brand.iconUrl ? (
              <img src={brand.iconUrl} alt={`${brand.name} logo`} loading="lazy" className="h-16 w-16 object-contain" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f4ff] text-base font-bold text-[#0285CE]">
                {brand.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="leading-tight text-[#5b5f7d]">{brand.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BrandStep;
