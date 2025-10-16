import gsap from 'gsap';
import { FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';

import AccentFormField from '@/components/AccentFormField';
import { HomeContent } from '@/hooks/useHomeContent';
import { logCustomerActivity } from '@/lib/customerActivityClient';
import { useAppStore } from '@/store/appStore';
import { useVehicleStore, type VehicleBrand, type VehicleModel } from '@/store/vehicleStore';
import { buildVehiclePath } from '@/utils/vehicleSlug';

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

const PHONE_NUMBER_PATTERN = /^\d{10}$/;
const MOCK_OTP_CODE = '1234';
const OTP_LENGTH = 4;
const SESSION_TOKEN_STORAGE_KEY = 'csw_customer_session_token';
const SESSION_PHONE_STORAGE_KEY = 'csw_customer_session_phone';

const LoadingIndicator = () => (
  <div className="flex items-center justify-center py-10">
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0285CE] border-t-transparent" aria-hidden />
    <span className="sr-only">Loading</span>
  </div>
);

type VehicleNavigationState = {
  selectedBrandSlug: string;
  selectedBrandName: string;
  selectedModelSlug: string;
  selectedModelName: string;
  selectedFuelType: string;
  phone: string;
};

type PendingNavigationState = {
  path: string;
  state: VehicleNavigationState;
};

interface VehicleSelectionInputProps {
  label: string;
  placeholder: string;
  value: string;
  onOpen: () => void;
  isComplete: boolean;
  onClear?: () => void;
}

const VehicleSelectionInput = ({
  label,
  placeholder,
  value,
  onOpen,
  isComplete,
  onClear
}: VehicleSelectionInputProps) => (
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
        value && onClear ? 'pr-12' : 'pr-4'
      } ${isComplete ? 'border-[#0285CE] font-semibold' : 'border-[#00AEEF]'}`}
    />
    {value && onClear && (
      <button
        type="button"
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onClear();
        }}
        className="absolute inset-y-0 right-4 flex items-center text-lg text-[#9aa6c2] transition hover:text-[#0285CE]"
        aria-label="Clear vehicle selection"
      >
        &times;
      </button>
    )}
  </label>
);

const HeroForm = ({ data }: { data: HomeContent['hero'] }) => {
  const { currentCity } = useAppStore();
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [sessionPhone, setSessionPhone] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigationState | null>(null);
  const [activeStep, setActiveStep] = useState<SelectorStep>(null);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(SESSION_TOKEN_STORAGE_KEY);
      const storedPhone = localStorage.getItem(SESSION_PHONE_STORAGE_KEY);

      if (storedToken) {
        setSessionToken(storedToken);
      }

      if (storedPhone) {
        setSessionPhone(storedPhone);
      }
    } catch (error) {
      console.error('Failed to read stored customer session.', error);
    }
  }, []);

  useEffect(() => {
    try {
      if (sessionToken) {
        localStorage.setItem(SESSION_TOKEN_STORAGE_KEY, sessionToken);
      } else {
        localStorage.removeItem(SESSION_TOKEN_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to persist customer session token.', error);
    }
  }, [sessionToken]);

  useEffect(() => {
    try {
      if (sessionPhone) {
        localStorage.setItem(SESSION_PHONE_STORAGE_KEY, sessionPhone);
      } else {
        localStorage.removeItem(SESSION_PHONE_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Failed to persist customer session phone.', error);
    }
  }, [sessionPhone]);

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

  const hasCompletedSelection = Boolean(selectedBrand && selectedModel && selectedFuelType);
  const hasActiveSession = Boolean(sessionToken);
  const shouldShowPhoneField = hasCompletedSelection && !hasActiveSession;
  const trimmedPhone = phone.trim();
  const isPhoneEntered = trimmedPhone.length > 0;
  const isPhoneValid = PHONE_NUMBER_PATTERN.test(trimmedPhone);
  const isSubmitDisabled = !hasCompletedSelection || isProcessing;
  const submitButtonLabel = isProcessing
    ? 'Saving...'
    : hasActiveSession
    ? 'Get A Quote'
    : isPhoneValid
    ? 'Get OTP'
    : 'Get A Quote';

  const focusOtpInput = (index: number) => {
    const input = otpInputRefs.current[index];
    if (input) {
      input.focus();
      input.select();
    }
  };

  const resetOtpFlow = () => {
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setPendingNavigation(null);
    setIsOtpModalOpen(false);
    setIsOtpVerifying(false);
  };

  const navigateToTarget = (path: string, state: VehicleNavigationState) => {
    setActiveStep(null);
    setMessage('');
    navigate(path, { state });
    setPhone('');
    resetSelection();
  };

  useEffect(() => {
    if (!isOtpModalOpen) {
      return;
    }
    const timer = setTimeout(() => focusOtpInput(0), 0);
    return () => clearTimeout(timer);
  }, [isOtpModalOpen]);

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

  const handleClearSelection = () => {
    resetSelection();
    setPhone('');
    setMessage('');
    resetOtpFlow();
    setActiveStep(null);
  };

  const buildVehiclePayload = () => {
    if (!selectedBrand || !selectedModel || !selectedFuelType) {
      throw new Error('Vehicle selection is incomplete.');
    }

    return {
      brandSlug: selectedBrand.slug,
      brandName: selectedBrand.name,
      modelSlug: selectedModel.slug,
      modelName: selectedModel.name,
      fuelType: selectedFuelType
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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

    setMessage('');
    setOtpError('');

    try {
      const vehiclePayload = buildVehiclePayload();
      const targetPath = buildVehiclePath(selectedFuelType, selectedBrand.slug, selectedModel.slug);
      const navigationState: VehicleNavigationState = {
        selectedBrandSlug: selectedBrand.slug,
        selectedBrandName: selectedBrand.name,
        selectedModelSlug: selectedModel.slug,
        selectedModelName: selectedModel.name,
        selectedFuelType,
        phone: hasActiveSession ? sessionPhone ?? '' : trimmedPhone
      };

      if (hasActiveSession && sessionToken) {
        setIsProcessing(true);
        const response = await logCustomerActivity({
          sessionToken,
          vehicle: vehiclePayload
        });

        setSessionToken(response.sessionToken);
        setSessionPhone(response.session.phone);

        navigateToTarget(targetPath, {
          ...navigationState,
          phone: response.session.phone
        });
        return;
      }

      if (isPhoneEntered && !isPhoneValid) {
        setMessage('Please enter a valid 10-digit mobile number.');
        return;
      }

      if (isPhoneValid) {
        setOtpDigits(Array(OTP_LENGTH).fill(''));
        setOtpError('');
        setPendingNavigation({ path: targetPath, state: navigationState });
        setIsOtpModalOpen(true);
        return;
      }

      navigateToTarget(targetPath, navigationState);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'We could not log this search right now. Please try again.';
      setMessage(errorMessage);
      console.error('Failed to handle hero form submission', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOtpClose = () => {
    resetOtpFlow();
  };

  const handleOtpDigitChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);

    setOtpDigits((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });

    if (otpError) {
      setOtpError('');
    }

    if (digit && index < OTP_LENGTH - 1) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleOtpVerify();
      return;
    }

    if (event.key === 'Backspace') {
      if (otpDigits[index]) {
        return;
      }

      if (index > 0) {
        event.preventDefault();
        setOtpDigits((previous) => {
          const next = [...previous];
          next[index - 1] = '';
          return next;
        });
        focusOtpInput(index - 1);
      }
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusOtpInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusOtpInput(index + 1);
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!pasted) {
      return;
    }

    const digits = pasted.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
    if (digits.length === 0) {
      return;
    }

    const nextDigits = Array.from({ length: OTP_LENGTH }, (_, idx) => digits[idx] ?? '');
    setOtpDigits(nextDigits);
    setOtpError('');

    const nextIndex = Math.min(digits.length, OTP_LENGTH) - 1;
    if (nextIndex >= 0) {
      focusOtpInput(nextIndex);
    }
  };

  const handleOtpVerify = async () => {
    const enteredOtp = otpDigits.join('');

    if (enteredOtp.length !== OTP_LENGTH) {
      setOtpError(`Please enter the ${OTP_LENGTH}-digit OTP.`);
      const firstEmptyIndex = otpDigits.findIndex((digit) => !digit);
      focusOtpInput(firstEmptyIndex >= 0 ? firstEmptyIndex : OTP_LENGTH - 1);
      return;
    }

    if (enteredOtp !== MOCK_OTP_CODE) {
      setOtpError('Incorrect OTP. Please try again.');
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      focusOtpInput(0);
      return;
    }

    if (!pendingNavigation) {
      return;
    }

    try {
      setIsOtpVerifying(true);

      const vehiclePayload = buildVehiclePayload();
      const response = await logCustomerActivity({
        phone: pendingNavigation.state.phone,
        otpCode: enteredOtp,
        vehicle: vehiclePayload
      });

      setSessionToken(response.sessionToken);
      setSessionPhone(response.session.phone);

      const nextState: VehicleNavigationState = {
        ...pendingNavigation.state,
        phone: response.session.phone
      };

      resetOtpFlow();
      navigateToTarget(pendingNavigation.path, nextState);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to verify the OTP right now. Please try again.';
      setOtpError(message);
      console.error('Failed to verify OTP for hero form', error);
    } finally {
      setIsOtpVerifying(false);
    }
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

  const otpModal =
    isOtpModalOpen && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-[#031135]/80 px-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
              <button
                type="button"
                onClick={handleOtpClose}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#6c74a0] transition hover:bg-[#eef6ff] hover:text-[#0285CE]"
                aria-label="Close OTP popup"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-lg font-semibold text-[#2a1454]">Verify OTP</h3>
              <p className="mt-2 text-sm text-[#6c74a0]">
                Enter the 4-digit code sent to {trimmedPhone || 'your phone number'}. Use {MOCK_OTP_CODE} to continue
                for now.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpInputRefs.current[index] = element;
                    }}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(event) => handleOtpDigitChange(event.currentTarget.value, index)}
                    onKeyDown={(event) => handleOtpKeyDown(event, index)}
                    onPaste={handleOtpPaste}
                    className="h-12 w-12 rounded-lg border border-[#dbe7f5] text-center text-lg font-semibold tracking-[0.2em] text-[#2a1454] focus:border-[#0285CE] focus:outline-none focus:ring-2 focus:ring-[#D6F0FF]"
                    aria-label={`OTP digit ${index + 1}`}
                  />
                ))}
              </div>
              {otpError && <p className="mt-4 text-xs font-medium text-center text-red-500">{otpError}</p>}
              <div className="mt-6 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleOtpClose}
                  className="flex-1 rounded-md border border-[#dbe7f5] px-4 py-3 text-sm font-semibold text-[#2a1454] transition hover:border-[#0285CE] hover:text-[#0285CE]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleOtpVerify}
                  disabled={isOtpVerifying}
                  className="flex-1 rounded-md bg-[#00AEEF] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_25px_rgba(2,150,228,0.25)] transition hover:bg-[#0285CE] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isOtpVerifying ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
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
              onClear={selectionSummary ? handleClearSelection : undefined}
            />

            {shouldShowPhoneField && (
              <AccentFormField
                label="Enter Mobile Number (Optional)"
                type="tel"
                value={phone}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(digits);
                  if (message) {
                    setMessage('');
                  }
                  if (otpError || isOtpModalOpen || pendingNavigation || otpDigits.some(Boolean)) {
                    resetOtpFlow();
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
            {submitButtonLabel}
          </button>
          {hasActiveSession && (
            <p className="text-xs text-[#6c74a0]">
              Logged in as{' '}
              <span className="font-semibold text-[#0285CE]">{sessionPhone ?? 'a verified customer'}</span>. Your
              searches are saved automatically.
            </p>
          )}
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
      {otpModal}
    </>
  );
};

export default HeroForm;
