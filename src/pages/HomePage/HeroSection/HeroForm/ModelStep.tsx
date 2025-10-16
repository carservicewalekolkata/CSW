import type { VehicleBrand, VehicleModel } from '@/store/vehicleStore';

export interface ModelStepProps {
  selectedBrand: VehicleBrand | null;
  availableModels: VehicleModel[];
  selectedModel: VehicleModel | null;
  onSelect: (model: VehicleModel) => void;
}

const ModelStep = ({ selectedBrand, availableModels, selectedModel, onSelect }: ModelStepProps) => {
  if (!selectedBrand) {
    return (
      <p className="py-6 text-sm text-[#6c74a0]">
        Choose a brand first and we will list all the supported models here.
      </p>
    );
  }

  if (availableModels.length === 0) {
    return (
      <p className="py-6 text-sm text-[#6c74a0]">
        We do not have models listed for {selectedBrand.name} yet. Please choose a different brand.
      </p>
    );
  }

  return (
    <div className="grid max-h-[340px] grid-cols-3 gap-4 overflow-y-auto pr-1 sm:grid-cols-4">
      {availableModels.map((model) => {
        const isSelected = selectedModel?.slug === model.slug;

        return (
          <button
            key={model.slug}
            type="button"
            onClick={() => onSelect(model)}
            className={`flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white p-4 text-center text-[11px] font-medium text-[#2a1454] shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
              isSelected ? 'border-[#0285CE] shadow-[0_0_0_3px_rgba(2,133,206,0.12)]' : ''
            }`}
          >
            {model.thumbnailUrl ? (
              <img src={model.thumbnailUrl} alt={model.name} loading="lazy" className="h-20 w-20 object-contain" />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e4f4ff] text-base font-bold text-[#0285CE]">
                {model.name.slice(0, 2).toUpperCase()}
              </span>
            )}
            <span className="leading-tight text-[#5b5f7d]">{model.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ModelStep;
