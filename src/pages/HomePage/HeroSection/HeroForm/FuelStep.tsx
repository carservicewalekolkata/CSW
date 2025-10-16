import type { VehicleBrand, VehicleModel } from '@/store/vehicleStore';

import { FUEL_ICON_MAP } from '@/constants/homepageHeroSectionData';

export interface FuelStepProps {
  selectedBrand: VehicleBrand | null;
  selectedModel: VehicleModel | null;
  availableFuelTypes: string[];
  selectedFuelType: string | null;
  onSelect: (fuel: string) => void;
}

const FuelStep = ({ selectedBrand, selectedModel, availableFuelTypes, selectedFuelType, onSelect }: FuelStepProps) => {
  if (!selectedModel || !selectedBrand) {
    return (
      <p className="py-6 text-sm text-[#6c74a0]">
        Pick a brand and model to see the available fuel types for your vehicle.
      </p>
    );
  }

  if (availableFuelTypes.length === 0) {
    return (
      <p className="py-6 text-sm text-[#6c74a0]">
        We do not have fuel information for {selectedModel.name}. Please pick another model.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#6c74a0]">
        {selectedBrand.name} · {selectedModel.name}
      </p>
      <div className="grid max-h-[280px] grid-cols-3 gap-4 overflow-y-auto pr-1 sm:grid-cols-4">
        {availableFuelTypes.map((fuel) => {
          const isSelected = selectedFuelType === fuel;
          const iconSrc = FUEL_ICON_MAP[fuel.toLowerCase()] ?? null;

          return (
            <button
              key={fuel}
              type="button"
              onClick={() => onSelect(fuel)}
              className={`flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white p-4 text-center text-[11px] font-medium text-[#2a1454] shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isSelected ? 'border-[#0285CE] shadow-[0_0_0_3px_rgba(2,133,206,0.12)]' : ''
              }`}
            >
              {iconSrc ? (
                <img src={iconSrc} alt={fuel} loading="lazy" className="h-16 w-16 object-contain" />
              ) : (
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f4ff] text-base font-bold text-[#0285CE]">
                  {fuel.slice(0, 2).toUpperCase()}
                </span>
              )}
              <span className="leading-tight text-[#5b5f7d]">{fuel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FuelStep;
