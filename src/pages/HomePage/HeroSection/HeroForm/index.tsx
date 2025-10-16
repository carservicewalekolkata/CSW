import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';

import { HomeContent } from '@/hooks/useHomeContent';
import { useHeroFormState } from '@/hooks/heroFormHooks/useHeroFormState';

import AccentFormField from '@/components/AccentFormField';

import BrandStep from './BrandStep';
import FuelStep from './FuelStep';
import ModelStep from './ModelStep';
import OtpModal from './OtpModal';
import SelectionSheet from './SelectionSheet';
import VehicleSelectionInput from './VehicleSelectionInput';
import { useHeroCarouselStore } from '@/store/heroCarouselStore';

const HeroForm = ({ data }: { data: HomeContent['hero'] }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const {
    cityName,
    isCityMentioned,
    beforeCity,
    afterCity,
    selectionSummary,
    shouldShowPhoneField,
    phone,
    message,
    hasActiveSession,
    sessionPhone,
    submitButtonLabel,
    isSubmitDisabled,
    trimmedPhone,
    handleSubmit,
    handlePhoneChange,
    handleClearSelection,
    openSelector,
    sheet,
    otp
  } = useHeroFormState(data);

  const { activeIndex } = useHeroCarouselStore();

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

  return (
    <>
      <div className="flex flex-col items-start justify-center lg:justify-end">
        <div
          ref={cardRef}
          className={`relative flex flex-col w-full max-w-[420px] ${sheet.isOpen ? 'h-[520px]' : 'h-fit'} rounded-md bg-white p-8 text-[#2a1454] shadow-[0_50px_120px_rgba(26,107,199,0.18)] ring-1 ring-white/80`}
        >
          <div>
            <h2 className="text-3xl font-light leading-snug text-[#2a1454]">
              {beforeCity}
              {isCityMentioned && <span className="font-extrabold text-[#00AEEF]">{cityName}</span>}
              {afterCity}
            </h2>
            <p className="mt-2 text-sm text-[#6c74a0]">Get instant quotes for your car service</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6"
          >
            {/* Inputs area */}
            <div className="flex flex-col space-y-5">
              <VehicleSelectionInput
                label="Your Vehicle"
                placeholder="Select brand, model & fuel type"
                value={selectionSummary}
                onOpen={openSelector}
                isComplete={shouldShowPhoneField}
                onClear={selectionSummary ? handleClearSelection : undefined}
              />

              {shouldShowPhoneField && (
                <AccentFormField
                  label="Enter Mobile Number (Optional)"
                  type="tel"
                  value={phone}
                  onChange={(event) => handlePhoneChange(event.target.value)}
                  placeholder="Enter mobile number"
                />
              )}
            </div>

            <div className='mt-10'>
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className={`mt-2 flex w-full items-center justify-center rounded-md px-6 py-4 text-sm font-semibold uppercase tracking-wide text-white transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0285CE] ${isSubmitDisabled
                  ? 'cursor-not-allowed bg-[#00AEEF]/50'
                  : 'bg-[#00AEEF] shadow-[0_15px_30px_rgba(2,150,228,0.35)] hover:bg-[#0285CE]'
                  }`}
              >
                {submitButtonLabel}
              </button>

              {hasActiveSession && (
                <p className="text-xs text-[#6c74a0] mt-1">
                  Logged in as{' '}
                  <span className="font-semibold text-[#0285CE]">
                    {sessionPhone ?? 'a verified customer'}
                  </span>. Your searches are saved automatically.
                </p>
              )}

              {message && (
                <p className="text-xs font-medium text-[#0285CE] mt-1">
                  {message}
                </p>
              )}
            </div>
          </form>

          <SelectionSheet
            isOpen={sheet.isOpen}
            activeStep={sheet.activeStep}
            currentTitle={sheet.title}
            currentSubtitle={sheet.subtitle}
            onBack={sheet.onBack}
            onClose={sheet.onClose}
            renderStep={(step) => {
              if (step === 'brand') return <BrandStep {...sheet.brandStepProps} />;
              if (step === 'model') return <ModelStep {...sheet.modelStepProps} />;
              return <FuelStep {...sheet.fuelStepProps} />;
            }}
          />
        </div>

        <div data-hero-text className="mt-10 flex items-center justify-center w-full max-w-[420px] gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition ${activeIndex === i ? 'scale-125 bg-[#1e51a3]' : 'bg-sky-200'
                }`}
            />
          ))}
        </div>
      </div>

      <OtpModal
        isOpen={otp.isOpen}
        trimmedPhone={trimmedPhone}
        digits={otp.digits}
        error={otp.error}
        isVerifying={otp.isVerifying}
        onClose={otp.onClose}
        onDigitChange={otp.onDigitChange}
        onKeyDown={otp.onKeyDown}
        onPaste={otp.onPaste}
        onVerify={otp.onVerify}
        setInputRef={otp.setInputRef}
      />
    </>
  );
};

export default HeroForm;
