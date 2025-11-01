import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useHeroSelectionSheet } from '@/hooks/heroFormHooks/useHeroSelectionSheet';
import { buildVehiclePath } from '@/utils/vehicleSlug';
import type { VehicleRouteState } from '@/types/servicePageUtilTypes';

// Reuse existing hero form UI parts
import VehicleSelectionInput from '@/pages/HomePage/HeroSection/HeroForm/VehicleSelectionInput';
import SelectionSheet from '@/pages/HomePage/HeroSection/HeroForm/SelectionSheet';
import BrandStep from '@/pages/HomePage/HeroSection/HeroForm/BrandStep';
import ModelStep from '@/pages/HomePage/HeroSection/HeroForm/ModelStep';
import FuelStep from '@/pages/HomePage/HeroSection/HeroForm/FuelStep';

const VehicleSelector = () => {
  const [message, setMessage] = useState('');
  const messageShownRef = useRef(false);
  const navigate = useNavigate();

  const clearMessage = () => message && setMessage('');
  const selection = useHeroSelectionSheet({ clearMessage });

  const isComplete = Boolean(selection.selectedBrand && selection.selectedModel && selection.selectedFuelType);

  const selectionSummary = selection.selectionSummary;

  const targetPath = useMemo(() => {
    if (!selection.selectedBrand || !selection.selectedModel) return null;
    return buildVehiclePath(
      selection.selectedBrand.slug,
      selection.selectedModel.slug,
      selection.selectedFuelType ?? null
    );
  }, [selection.selectedBrand, selection.selectedModel, selection.selectedFuelType]);

  const handleNavigate = () => {
    if (!isComplete || !selection.selectedBrand || !selection.selectedModel) {
      setMessage('Select brand, model and fuel to continue.');
      selection.openSelector();
      return;
    }

    if (!targetPath) return;

    const state: VehicleRouteState = {
      selectedBrandSlug: selection.selectedBrand.slug,
      selectedBrandName: selection.selectedBrand.name,
      selectedModelSlug: selection.selectedModel.slug,
      selectedModelName: selection.selectedModel.name,
      selectedFuelType: selection.selectedFuelType ?? undefined
    };

    navigate(targetPath, { state, replace: false });
  };

  // Optional UX: if user just completed fuel selection inside the sheet, prompt CTA once
  useEffect(() => {
    if (isComplete && !messageShownRef.current) {
      setMessage('Great! Click “View services” to see packages for your car.');
      messageShownRef.current = true;
    }
  }, [isComplete]);

  return (
    <section className="bg-white py-6">
      <div className="container-cs">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 min-w-[260px]">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Select Vehicle</p>
              <div className="mt-2 max-w-xl">
                <VehicleSelectionInput
                  label="Your Vehicle"
                  placeholder="Select brand, model & fuel type"
                  value={selectionSummary}
                  onOpen={selection.openSelector}
                  isComplete={isComplete}
                  onClear={selectionSummary ? selection.resetVehicleSelection : undefined}
                />
              </div>
              {message ? <p className="mt-2 text-xs font-medium text-brand-600">{message}</p> : null}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleNavigate}
                disabled={!isComplete}
                className={`rounded-md px-5 py-3 text-sm font-semibold text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400 ${
                  isComplete ? 'bg-brand-600 hover:bg-brand-700' : 'bg-brand-400 cursor-not-allowed'
                }`}
              >
                View services
              </button>
            </div>
          </div>

          <SelectionSheet
            isOpen={selection.sheet.isOpen}
            activeStep={selection.sheet.activeStep}
            currentTitle={selection.sheet.title}
            currentSubtitle={selection.sheet.subtitle}
            onBack={selection.sheet.onBack}
            onClose={selection.sheet.onClose}
            renderStep={(step) => {
              if (step === 'brand') return <BrandStep {...selection.sheet.brandStepProps} />;
              if (step === 'model') return <ModelStep {...selection.sheet.modelStepProps} />;
              return <FuelStep {...selection.sheet.fuelStepProps} />;
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default VehicleSelector;
