import gsap from 'gsap';
import { FormEvent, useLayoutEffect, useMemo, useRef, useState } from 'react';

import AccentFormField from '@/components/AccentFormField';
import { HomeContent } from '@/hooks/useHomeContent';
import { useAppStore } from '@/store/appStore';
import { useVehicleStore, type VehicleBrand, type VehicleModel } from '@/store/vehicleStore';

const STEP_SEQUENCE = ['brand', 'model', 'fuel'] as const;
type StepKey = (typeof STEP_SEQUENCE)[number];
type SelectorStep = StepKey | null;

const FUEL_ICON_MAP: Record<string, string> = {
  petrol: '/images/icons/general/petrol.png',
  diesel: '/images/icons/general/gasoline.png',
  cng: '/images/icons/general/gas-station.png',
  lpg: '/images/icons/general/gas-station.png',
  electric: '/images/icons/general/mobile.svg',
  hybrid: '/images/icons/general/plan.svg'
};

const LoadingIndicator = () => (
  <div className="flex items-center justify-center py-10">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0285CE] border-t-transparent" aria-hidden />
    <span className="sr-only">Loading</span>
  </div>
);

interface VehicleSelectionInputProps {
  label: string;
  placeholder: string;
  value: string;
  onOpen: () => void;
  isComplete: boolean;
}

const VehicleSelectionInput = ({ label, placeholder, value, onOpen, isComplete }: VehicleSelectionInputProps) => (
  <label className="relative block">
    <span className="absolute -top-3 left-4 bg-white px-1 text-[13px] font-semibold text-[#2a1454]">{label}</span>
    <input
      type="text"
      value={value}
      readOnly
      placeholder={placeholder}
      onFocus={onOpen}
      onClick={(event) => {
        event.preventDefault();
        onOpen();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      className={`w-full rounded-md border bg-white p-4 text-sm text-[#2a1454] placeholder:text-[#9aa6c2] transition focus:border-[#0285CE] focus:outline-none focus:ring-4 focus:ring-[#D6F0FF] ${
        isComplete ? 'border-[#0285CE] font-semibold' : 'border-[#00AEEF]'
      }`}
    />
  </label>
);

const HeroForm = ({ data }: { data: HomeContent['hero'] }) => {
  const { currentCity } = useAppStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
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

  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const timeline = gsap.fromTo(
      cardRef.current,
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power2.out' }
    );
    return () => {
      timeline.kill();
    };
  }, []);

  const [beforeCity, afterCity] = data.subheadline.includes(currentCity.name)
    ? data.subheadline.split(currentCity.name)
    : [data.subheadline, ''];

  const selectionSummary = useMemo(() => {
    if (selectedBrand && selectedModel && selectedFuelType) {
      return `${selectedFuelType} ${selectedBrand.name} ${selectedModel.name}`;
    }
    if (selectedBrand && selectedModel) {
      return `${selectedBrand.name} ${selectedModel.name}`;
    }
    if (selectedBrand) {
      return selectedBrand.name;
    }
    return '';
  }, [selectedBrand, selectedModel, selectedFuelType]);

  const availableModels = useMemo<VehicleModel[]>(() => {
    if (!selectedBrand) {
      return [];
    }
    return modelsByBrand[selectedBrand.slug] ?? [];
  }, [modelsByBrand, selectedBrand]);

  const availableFuelTypes = useMemo<string[]>(() => selectedModel?.fuelTypes ?? [], [selectedModel]);

  const shouldShowPhoneField = Boolean(selectedBrand && selectedModel && selectedFuelType);
  const isSubmitDisabled = !shouldShowPhoneField || !phone.trim();

  const openSelector = () => {
    const nextStep: StepKey = !selectedBrand ? 'brand' : !selectedModel ? 'model' : 'fuel';
    setMessage('');
    setActiveStep(nextStep);

    if (nextStep === 'brand' && !hasLoadedCatalog && !isLoadingCatalog) {
      void fetchVehicleCatalog();
    }
  };

  const handleBack = () => {
    if (!activeStep) {
      return;
    }

    if (activeStep === 'brand') {
      setActiveStep(null);
      return;
    }

    const currentIndex = STEP_SEQUENCE.indexOf(activeStep);
    const previousStep = STEP_SEQUENCE[currentIndex - 1];
    setActiveStep(previousStep);
  };

  const handleCloseSheet = () => {
    setActiveStep(null);
  };

  const handleBrandSelect = (brand: VehicleBrand) => {
    selectBrand(brand);
    setMessage('');
    setActiveStep('model');
  };

  const handleModelSelect = (model: VehicleModel) => {
    if (!selectedBrand) {
      return;
    }
    selectModel(model);
    setMessage('');
    setActiveStep('fuel');
  };

  const handleFuelSelect = (fuelType: string) => {
    if (!selectedModel) {
      return;
    }
    setFuelType(fuelType);
    setMessage('');
    setActiveStep(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedBrand) {
      setMessage('Please choose your car brand so we can personalise your quote.');
      setActiveStep('brand');
      return;
    }

    if (!selectedModel) {
      setMessage('Select your car model to continue.');
      setActiveStep('model');
      return;
    }

    if (!selectedFuelType) {
      setMessage('Pick the fuel type for your vehicle.');
      setActiveStep('fuel');
      return;
    }

    if (!phone.trim()) {
      setMessage('Please share your contact number so our advisor can call you back.');
      return;
    }

    setMessage('Thanks! Our service advisor will call you within 15 minutes.');
    setPhone('');
    resetSelection();
    setActiveStep(null);
  };

  const renderBrandContent = () => {
    if (isLoadingCatalog && !hasLoadedCatalog) {
      return <LoadingIndicator />;
    }

    if (catalogError) {
      return (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          <p>{catalogError}</p>
          <button
            type="button"
            onClick={() => void fetchVehicleCatalog()}
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
              onClick={() => handleBrandSelect(brand)}
              className={`flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white p-4 text-center text-[11px] font-semibold uppercase tracking-wide text-[#2a1454] shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isSelected ? 'border-[#0285CE] shadow-[0_0_0_3px_rgba(2,133,206,0.12)]' : ''
              }`}
            >
              {brand.iconUrl ? (
                <img
                  src={brand.iconUrl}
                  alt={`${brand.name} logo`}
                  loading="lazy"
                  className="h-16 w-16 object-contain"
                />
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

  const renderModelContent = () => {
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
              onClick={() => handleModelSelect(model)}
              className={`flex flex-col items-center gap-2 rounded-2xl border border-transparent bg-white p-4 text-center text-[11px] font-medium text-[#2a1454] shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${
                isSelected ? 'border-[#0285CE] shadow-[0_0_0_3px_rgba(2,133,206,0.12)]' : ''
              }`}
            >
              {model.thumbnailUrl ? (
                <img
                  src={model.thumbnailUrl}
                  alt={model.name}
                  loading="lazy"
                  className="h-20 w-20 object-contain"
                />
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

  const renderFuelContent = () => {
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
                onClick={() => handleFuelSelect(fuel)}
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

  const isSheetOpen = Boolean(activeStep);
  const stepWidthPercent = 100 / STEP_SEQUENCE.length;
  const totalWidthPercent = STEP_SEQUENCE.length * 100;
  const activeIndex = activeStep ? STEP_SEQUENCE.indexOf(activeStep) : 0;
  const currentTitle =
    activeStep === 'brand'
      ? 'Popular Brands'
      : activeStep === 'model'
      ? `Choose a ${selectedBrand?.name ?? ''} model`
      : activeStep === 'fuel'
      ? 'Select fuel type'
      : '';
  const currentSubtitle =
    activeStep === 'brand'
      ? 'Tap a brand to continue'
      : activeStep === 'model'
      ? 'Pick the exact model you drive'
      : activeStep === 'fuel'
      ? 'What fuel does your car use?'
      : '';

  return (
    <div className="flex items-start justify-center lg:justify-end">
      <div
        ref={cardRef}
        className="relative w-full max-w-[420px] rounded-md bg-white p-8 pb-16 text-[#2a1454] shadow-[0_50px_120px_rgba(26,107,199,0.18)] ring-1 ring-white/80"
      >
        <h2 className="text-3xl font-light leading-snug text-[#2a1454]">
          {beforeCity}
          {data.subheadline.includes(currentCity.name) && (
            <span className="font-extrabold text-[#00AEEF]">{currentCity.name}</span>
          )}
          {afterCity}
        </h2>
        <p className="mt-2 text-sm text-[#6c74a0]">Get instant quotes for your car service</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <VehicleSelectionInput
            label="Your Vehicle"
            placeholder="Select brand, model & fuel type"
            value={selectionSummary}
            onOpen={openSelector}
            isComplete={shouldShowPhoneField}
          />

          {shouldShowPhoneField && (
            <AccentFormField
              label="Enter Mobile Number"
              type="tel"
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value);
                if (message) {
                  setMessage('');
                }
              }}
              placeholder="Enter mobile number"
            />
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={`mt-2 flex w-full items-center justify-center rounded-md px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0285CE] ${
              isSubmitDisabled
                ? 'cursor-not-allowed bg-[#00AEEF]/50'
                : 'bg-[#00AEEF] shadow-[0_15px_30px_rgba(2,150,228,0.35)] hover:bg-[#0285CE]'
            }`}
          >
            Get A Quote
          </button>
          {message && <p className="text-xs font-medium text-[#0285CE]">{message}</p>}
        </form>

        <div
          className={`absolute inset-0 z-20 overflow-hidden rounded-md bg-white transition-all duration-300 ease-out ${
            isSheetOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          } ${isSheetOpen ? 'translate-y-0' : 'translate-y-4'}`}
          aria-hidden={!isSheetOpen}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[#dbe7f5] px-5 py-4">
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1 text-sm font-semibold text-[#0285CE] transition hover:text-[#026aa2]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <div className="flex-1 text-center">
                <p className="text-sm font-semibold text-[#2a1454]">{currentTitle}</p>
                <p className="text-xs text-[#6c74a0]">{currentSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseSheet}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6c74a0] transition hover:bg-[#eef6ff] hover:text-[#0285CE]"
                aria-label="Close selection"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative flex-1 overflow-hidden">
              <div
                className="flex h-full transition-transform duration-300 ease-out"
                style={{
                  width: `${totalWidthPercent}%`,
                  transform: `translateX(-${activeIndex * stepWidthPercent}%)`
                }}
              >
                {STEP_SEQUENCE.map((step) => (
                  <section
                    key={step}
                    className="h-full shrink-0 overflow-y-auto px-5 py-5"
                    style={{ width: `${stepWidthPercent}%` }}
                  >
                    {step === 'brand' && renderBrandContent()}
                    {step === 'model' && renderModelContent()}
                    {step === 'fuel' && renderFuelContent()}
                  </section>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroForm;
