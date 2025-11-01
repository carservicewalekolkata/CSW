import { useEffect, useMemo, startTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import { useHeroSelectionSheet } from '@/hooks/heroFormHooks/useHeroSelectionSheet';
import SelectionSheet from '@/pages/HomePage/HeroSection/HeroForm/SelectionSheet';
import BrandStep from '@/pages/HomePage/HeroSection/HeroForm/BrandStep';
import ModelStep from '@/pages/HomePage/HeroSection/HeroForm/ModelStep';
import FuelStep from '@/pages/HomePage/HeroSection/HeroForm/FuelStep';
import { buildVehiclePath } from '@/utils/vehicleSlug';
import type { VehicleRouteState } from '@/types/servicePageUtilTypes';

const ServicesWizardPage = () => {
  const navigate = useNavigate();

  const clearMessage = () => {};
  const selection = useHeroSelectionSheet({ clearMessage });

  useEffect(() => {
    // Open the selector on page load at the correct step
    selection.openSelector();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { selectedBrand, selectedModel, selectedFuelType } = selection;
    if (!selectedBrand || !selectedModel || !selectedFuelType) return;

    const path = buildVehiclePath(selectedBrand.slug, selectedModel.slug, selectedFuelType);
    const state: VehicleRouteState = {
      selectedBrandSlug: selectedBrand.slug,
      selectedBrandName: selectedBrand.name,
      selectedModelSlug: selectedModel.slug,
      selectedModelName: selectedModel.name,
      selectedFuelType
    };
    startTransition(() => navigate(path, { state, replace: true }));
  }, [selection.selectedBrand, selection.selectedModel, selection.selectedFuelType]);

  const active = selection.sheet.activeStep || 'brand';
  const stepIndex = useMemo(() => (active === 'brand' ? 0 : active === 'model' ? 1 : 2), [active]);

  return (
    <>
      <Helmet>
        <title>Select Your Vehicle | Car Service Wale</title>
        <meta name="description" content="Choose your brand, model and fuel type to view tailored service packages and pricing." />
      </Helmet>
      <section className="bg-gradient-to-b from-[#F6FAFF] via-[#F1F7FF] to-[#F7FBFF] py-12">
        <div className="container-cs max-w-5xl">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-500/80">Car Service Wale</p>
              <h1 className="text-3xl font-bold text-indigo-950">Select Your Vehicle</h1>
              <p className="max-w-3xl text-sm text-slate-600">
                Choose your brand, model and fuel type to see service packages compatible with your car. This helps us
                show accurate pricing, time estimates, and availability.
              </p>
            </div>
            <Link to="/" className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 md:inline-flex">
              Back to Home
            </Link>
          </div>

          {/* Step indicator */}
          <ol className="mt-6 flex items-center gap-3 text-xs font-semibold text-slate-500">
            {['Choose brand', 'Choose model', 'Choose fuel type'].map((label, i) => (
              <li key={label} className="flex items-center gap-2">
                <span
                  className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 ${
                    i <= stepIndex ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`${i === stepIndex ? 'text-indigo-950' : ''}`}>{label}</span>
                {i < 2 && <span className="mx-2 h-px w-8 bg-slate-300" aria-hidden />}
              </li>
            ))}
          </ol>

          {/* Wizard container */}
          <div className="relative mt-6 h-[620px] w-full">
            <div className="absolute inset-0 rounded-2xl border border-slate-200 bg-white shadow-[0_30px_90px_rgba(0,174,236,0.18)]" />
            <SelectionSheet
              isOpen={true}
              activeStep={active}
              currentTitle={selection.sheet.title}
              currentSubtitle={selection.sheet.subtitle}
              onBack={selection.sheet.onBack}
              onClose={() => navigate('/')}
              renderStep={(step) => {
                if (step === 'brand') return <BrandStep {...selection.sheet.brandStepProps} />;
                if (step === 'model') return <ModelStep {...selection.sheet.modelStepProps} />;
                return <FuelStep {...selection.sheet.fuelStepProps} />;
              }}
            />
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Tip: You can change your vehicle later from the services page. We never share your details with third parties.
          </p>
        </div>
      </section>
    </>
  );
};

export default ServicesWizardPage;
