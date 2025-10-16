import { useMemo, useState } from 'react';

import {
  useVehicleStore,
  type VehicleBrand,
  type VehicleModel
} from '@/store/vehicleStore';

import {
  STEP_SEQUENCE,
  type SelectorStep,
  type StepKey
} from '@/constants/homepageHeroSectionData';
import type { BrandStepProps } from '@/pages/HomePage/HeroSection/HeroForm/BrandStep';
import type { FuelStepProps } from '@/pages/HomePage/HeroSection/HeroForm/FuelStep';
import type { ModelStepProps } from '@/pages/HomePage/HeroSection/HeroForm/ModelStep';

const getSheetTitle = (step: SelectorStep, brand?: VehicleBrand | null) => {
  if (step === 'brand') return 'Popular Brands';
  if (step === 'model') return `Choose a ${brand?.name ?? ''} model`;
  if (step === 'fuel') return 'Select fuel type';
  return '';
};

const getSheetSubtitle = (step: SelectorStep) => {
  if (step === 'brand') return 'Tap a brand to continue';
  if (step === 'model') return 'Pick the exact model you drive';
  if (step === 'fuel') return 'What fuel does your car use?';
  return '';
};

interface UseHeroSelectionSheetOptions {
  clearMessage: () => void;
}

export const useHeroSelectionSheet = ({ clearMessage }: UseHeroSelectionSheetOptions) => {
  const [activeStep, setActiveStep] = useState<SelectorStep>(null);
  const {
    brands,
    modelsByBrand,
    isLoadingCatalog,
    hasLoadedCatalog,
    catalogError,
    fetchVehicleCatalog,
    selectBrand,
    selectModel,
    setFuelType,
    resetSelection,
    selectedBrand,
    selectedModel,
    selectedFuelType
  } = useVehicleStore();

  const normalizedBrand = selectedBrand ?? null;
  const normalizedModel = selectedModel ?? null;
  const normalizedFuelType = selectedFuelType ?? null;

  const selectionSummary = useMemo(() => {
    if (selectedBrand && selectedModel && selectedFuelType) {
      return `${selectedFuelType} ${selectedBrand.name} ${selectedModel.name}`;
    }
    if (selectedBrand && selectedModel) return `${selectedBrand.name} ${selectedModel.name}`;
    if (selectedBrand) return selectedBrand.name;
    return '';
  }, [selectedBrand, selectedModel, selectedFuelType]);

  const availableModels = useMemo<VehicleModel[]>(() => {
    if (!selectedBrand) return [];
    return modelsByBrand[selectedBrand.slug] ?? [];
  }, [modelsByBrand, selectedBrand]);

  const availableFuelTypes = useMemo<string[]>(() => selectedModel?.fuelTypes ?? [], [selectedModel]);

  const hasCompletedSelection = Boolean(normalizedBrand && normalizedModel && normalizedFuelType);

  const goToStep = (step: SelectorStep) => {
    clearMessage();
    setActiveStep(step);
    if (step === 'brand' && !hasLoadedCatalog && !isLoadingCatalog) {
      void fetchVehicleCatalog();
    }
  };

  const openSelector = () => {
    const nextStep: StepKey = !selectedBrand ? 'brand' : !selectedModel ? 'model' : 'fuel';
    goToStep(nextStep);
  };

  const handleBack = () => {
    if (!activeStep) return;
    if (activeStep === 'brand') {
      setActiveStep(null);
      return;
    }
    const currentIndex = STEP_SEQUENCE.indexOf(activeStep);
    goToStep(STEP_SEQUENCE[currentIndex - 1]);
  };

  const handleCloseSheet = () => setActiveStep(null);

  const handleBrandSelect = (brand: VehicleBrand) => {
    selectBrand(brand);
    clearMessage();
    setActiveStep('model');
  };

  const handleModelSelect = (model: VehicleModel) => {
    if (!selectedBrand) return;
    selectModel(model);
    clearMessage();
    setActiveStep('fuel');
  };

  const handleFuelSelect = (fuelType: string) => {
    if (!selectedModel) return;
    setFuelType(fuelType);
    clearMessage();
    setActiveStep(null);
  };

  const brandStepProps: BrandStepProps = {
    brands,
    selectedBrand: normalizedBrand,
    isLoadingCatalog,
    hasLoadedCatalog,
    catalogError: catalogError ?? null,
    onRetry: () => void fetchVehicleCatalog(),
    onSelect: handleBrandSelect
  };

  const modelStepProps: ModelStepProps = {
    selectedBrand: normalizedBrand,
    availableModels,
    selectedModel: normalizedModel,
    onSelect: handleModelSelect
  };

  const fuelStepProps: FuelStepProps = {
    selectedBrand: normalizedBrand,
    selectedModel: normalizedModel,
    availableFuelTypes,
    selectedFuelType: normalizedFuelType,
    onSelect: handleFuelSelect
  };

  return {
    selectedBrand: normalizedBrand,
    selectedModel: normalizedModel,
    selectedFuelType: normalizedFuelType,
    selectionSummary,
    availableModels,
    availableFuelTypes,
    hasCompletedSelection,
    openSelector,
    goToStep,
    resetVehicleSelection: resetSelection,
    sheet: {
      isOpen: Boolean(activeStep),
      activeStep,
      onBack: handleBack,
      onClose: handleCloseSheet,
      title: getSheetTitle(activeStep, normalizedBrand),
      subtitle: getSheetSubtitle(activeStep),
      brandStepProps,
      modelStepProps,
      fuelStepProps
    }
  };
};
