import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { HomeContent } from '@/hooks/useHomeContent';
import { logCustomerActivity } from '@/lib/customerActivityClient';
import { buildVehiclePath } from '@/utils/vehicleSlug';

import { PHONE_NUMBER_PATTERN } from '@/constants/homepageHeroSectionData';
import type { PendingNavigationState, VehicleNavigationState, VehiclePayload } from '@/types/homepageHeroFormTypes';
import { useHeroHeadline } from './useHeroHeadline';
import { useHeroOtp } from './useHeroOtp';
import { useHeroSelectionSheet } from './useHeroSelectionSheet';
import { useHeroSession } from './useHeroSession';

type SelectionState = ReturnType<typeof useHeroSelectionSheet>;

const buildVehiclePayload = (selection: SelectionState): VehiclePayload | null => {
  if (!selection.selectedBrand || !selection.selectedModel || !selection.selectedFuelType) return null;
  return {
    brandSlug: selection.selectedBrand.slug,
    brandName: selection.selectedBrand.name,
    modelSlug: selection.selectedModel.slug,
    modelName: selection.selectedModel.name,
    fuelType: selection.selectedFuelType
  };
};

const createNavigationState = (selection: SelectionState, phone: string): VehicleNavigationState => ({
  selectedBrandSlug: selection.selectedBrand!.slug,
  selectedBrandName: selection.selectedBrand!.name,
  selectedModelSlug: selection.selectedModel!.slug,
  selectedModelName: selection.selectedModel!.name,
  selectedFuelType: selection.selectedFuelType!,
  phone
});

export const useHeroFormState = (data: HomeContent['hero']) => {
  const headline = useHeroHeadline(data);
  const navigate = useNavigate();
  const { sessionToken, setSessionToken, sessionPhone, setSessionPhone, hasActiveSession } = useHeroSession();
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const clearMessage = () => message && setMessage('');
  const selection = useHeroSelectionSheet({ clearMessage });
  const getVehiclePayload = () => buildVehiclePayload(selection);
  const navigateToTarget = (path: string, state: VehicleNavigationState) => {
    selection.sheet.onClose();
    setMessage('');
    navigate(path, { state });
    setPhone('');
    selection.resetVehicleSelection();
  };

  const otp = useHeroOtp({ getVehiclePayload, onSuccess: navigateToTarget, setSessionToken, setSessionPhone });

  const shouldShowPhoneField = selection.hasCompletedSelection && !hasActiveSession;
  const trimmedPhone = phone.trim();
  const isPhoneEntered = trimmedPhone.length > 0;
  const isPhoneValid = PHONE_NUMBER_PATTERN.test(trimmedPhone);
  const isSubmitDisabled = !selection.hasCompletedSelection || isProcessing;
  const submitButtonLabel = isProcessing
    ? 'Saving...'
    : hasActiveSession
    ? 'Get A Quote'
    : isPhoneValid
    ? 'Get OTP'
    : 'Get A Quote';

  const handleClearSelection = () => {
    selection.resetVehicleSelection();
    setPhone('');
    setMessage('');
    otp.resetOtpFlow();
  };

  const handlePhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    clearMessage();
    if (otp.otpModal.isOpen || otp.hasPendingNavigation || otp.otpModal.digits.some(Boolean) || otp.otpModal.error) {
      otp.resetOtpFlow();
    }
  };

  const ensureSelection = () => {
    if (!selection.selectedBrand) {
      setMessage('Please choose your car brand so we can personalise your quote.');
      selection.goToStep('brand');
      return false;
    }
    if (!selection.selectedModel) {
      setMessage('Select your car model to continue.');
      selection.goToStep('model');
      return false;
    }
    if (!selection.selectedFuelType) {
      setMessage('Pick the fuel type for your vehicle.');
      selection.goToStep('fuel');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!ensureSelection() || !selection.selectedBrand || !selection.selectedModel || !selection.selectedFuelType) return;

    setMessage('');
    const vehiclePayload = getVehiclePayload();
    if (!vehiclePayload) return;

    const targetPath = buildVehiclePath(
      selection.selectedFuelType,
      selection.selectedBrand.slug,
      selection.selectedModel.slug
    );

    const navigationState = createNavigationState(selection, hasActiveSession ? sessionPhone ?? '' : trimmedPhone);

    if (hasActiveSession && sessionToken) {
      try {
        setIsProcessing(true);
        const response = await logCustomerActivity({ sessionToken, vehicle: vehiclePayload });
        setSessionToken(response.sessionToken);
        setSessionPhone(response.session.phone);
        navigateToTarget(targetPath, { ...navigationState, phone: response.session.phone });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'We could not log this search right now. Please try again.';
        setMessage(errorMessage);
        console.error('Failed to handle hero form submission', error);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (isPhoneEntered && !isPhoneValid) {
      setMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (isPhoneValid) {
      const pending: PendingNavigationState = { path: targetPath, state: navigationState };
      otp.startOtpFlow(pending);
      return;
    }

    navigateToTarget(targetPath, navigationState);
  };

  return {
    cityName: headline.cityName,
    isCityMentioned: headline.isCityMentioned,
    beforeCity: headline.beforeCity,
    afterCity: headline.afterCity,
    selectionSummary: selection.selectionSummary,
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
    openSelector: selection.openSelector,
    sheet: selection.sheet,
    otp: otp.otpModal
  };
};
