import { useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';

import { logCustomerActivity } from '@/lib/customerActivityClient';

import { MOCK_OTP_CODE, OTP_LENGTH } from '@/constants/homepageHeroSectionData';
import type { PendingNavigationState, VehicleNavigationState, VehiclePayload } from '@/types/homepageHeroFormTypes';

interface UseHeroOtpOptions {
  getVehiclePayload: () => VehiclePayload | null;
  onSuccess: (path: string, state: VehicleNavigationState) => void;
  setSessionToken: (token: string) => void;
  setSessionPhone: (phone: string) => void;
}

export const useHeroOtp = ({ getVehiclePayload, onSuccess, setSessionToken, setSessionPhone }: UseHeroOtpOptions) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigationState | null>(null);
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

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

  const startOtpFlow = (navigation: PendingNavigationState) => {
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setPendingNavigation(navigation);
    setIsOtpModalOpen(true);
  };

  useEffect(() => {
    if (!isOtpModalOpen) return;
    const timer = setTimeout(() => focusOtpInput(0), 0);
    return () => clearTimeout(timer);
  }, [isOtpModalOpen]);

  const handleOtpDigitChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setOtpDigits((previous) => {
      const next = [...previous];
      next[index] = digit;
      return next;
    });
    if (otpError) setOtpError('');
    if (digit && index < OTP_LENGTH - 1) focusOtpInput(index + 1);
  };

  const handleOtpKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      void handleOtpVerify();
      return;
    }
    if (event.key === 'Backspace') {
      if (otpDigits[index]) return;
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
    }
    if (event.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      event.preventDefault();
      focusOtpInput(index + 1);
    }
  };

  const handleOtpPaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text') ?? '';
    if (!pasted) return;
    const digits = pasted.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
    if (digits.length === 0) return;
    const nextDigits = Array.from({ length: OTP_LENGTH }, (_, idx) => digits[idx] ?? '');
    setOtpDigits(nextDigits);
    setOtpError('');
    const nextIndex = Math.min(digits.length, OTP_LENGTH) - 1;
    if (nextIndex >= 0) focusOtpInput(nextIndex);
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
    if (!pendingNavigation) return;

    const vehiclePayload = getVehiclePayload();
    if (!vehiclePayload) {
      setOtpError('Vehicle selection is incomplete. Please try again.');
      return;
    }

    try {
      setIsOtpVerifying(true);
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
      onSuccess(pendingNavigation.path, nextState);
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : 'Unable to verify the OTP right now. Please try again.';
      setOtpError(messageText);
      console.error('Failed to verify OTP for hero form', error);
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const setInputRef = (index: number, element: HTMLInputElement | null) => {
    otpInputRefs.current[index] = element;
  };

  return {
    startOtpFlow,
    resetOtpFlow,
    hasPendingNavigation: Boolean(pendingNavigation),
    otpModal: {
      isOpen: isOtpModalOpen,
      digits: otpDigits,
      error: otpError,
      isVerifying: isOtpVerifying,
      onClose: resetOtpFlow,
      onDigitChange: handleOtpDigitChange,
      onKeyDown: handleOtpKeyDown,
      onPaste: handleOtpPaste,
      onVerify: () => void handleOtpVerify(),
      setInputRef
    }
  };
};
