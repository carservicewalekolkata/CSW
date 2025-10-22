import { useEffect, useRef, useState } from 'react';
import type { ClipboardEvent, KeyboardEvent } from 'react';

import { logCustomerActivity } from '@/lib/customerActivityClient';
import { requestOtpCode, verifyOtpCode } from '@/lib/otpClient';

import { OTP_LENGTH } from '@/constants/homepageHeroSectionData';
import type { PendingNavigationState, VehicleNavigationState, VehiclePayload } from '@/types/homepageHeroFormTypes';

interface UseHeroOtpOptions {
  getVehiclePayload: () => VehiclePayload | null;
  onSuccess: (path: string, state: VehicleNavigationState) => void;
  setSessionToken: (token: string) => void;
  setSessionPhone: (phone: string) => void;
}

const extractErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed && typeof parsed === 'object' && typeof (parsed as { message?: unknown }).message === 'string') {
        return (parsed as { message: string }).message;
      }
    } catch {
      // ignore parsing issues – fail back to message string
    }
    return error.message;
  }
  return fallback;
};

export const useHeroOtp = ({ getVehiclePayload, onSuccess, setSessionToken, setSessionPhone }: UseHeroOtpOptions) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(() => Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<PendingNavigationState | null>(null);
  const [otpRequestId, setOtpRequestId] = useState<string | null>(null);
  const [otpPhone, setOtpPhone] = useState<string | null>(null);
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
    setOtpRequestId(null);
    setOtpPhone(null);
    setIsOtpModalOpen(false);
    setIsOtpVerifying(false);
  };

  const startOtpFlow = (navigation: PendingNavigationState, requestId: string, phone: string) => {
    setOtpDigits(Array(OTP_LENGTH).fill(''));
    setOtpError('');
    setPendingNavigation(navigation);
    setOtpRequestId(requestId);
    setOtpPhone(phone);
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
    if (!pendingNavigation) return;

    if (!otpRequestId || !otpPhone) {
      setOtpError('Your OTP session has expired. Please request a new OTP.');
      window.alert('Your OTP session has expired. Please request a new OTP.');
      return;
    }

    const vehiclePayload = getVehiclePayload();
    if (!vehiclePayload) {
      setOtpError('Vehicle selection is incomplete. Please try again.');
      return;
    }

    try {
      setIsOtpVerifying(true);
      await verifyOtpCode({ requestId: otpRequestId, phone: pendingNavigation.state.phone, otp: enteredOtp });
      window.alert('OTP verified successfully.');
      const response = await logCustomerActivity({
        phone: pendingNavigation.state.phone,
        otpRequestId,
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
      const messageText = extractErrorMessage(error, 'Unable to verify the OTP right now. Please try again.');
      setOtpError(messageText);
      console.error('Failed to verify OTP for hero form', error);
      window.alert(messageText);
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const setInputRef = (index: number, element: HTMLInputElement | null) => {
    otpInputRefs.current[index] = element;
  };

  return {
    requestOtp: async (phone: string, navigation: PendingNavigationState) => {
      const trimmedPhone = phone.replace(/\D/g, '');
      try {
        setIsOtpSending(true);
        const response = await requestOtpCode(trimmedPhone);
        startOtpFlow(navigation, response.requestId, trimmedPhone);
      } catch (error) {
        const messageText = extractErrorMessage(error, 'Unable to send OTP right now. Please try again.');
        console.error('Failed to request OTP for hero form', error);
        throw new Error(messageText);
      } finally {
        setIsOtpSending(false);
      }
    },
    resetOtpFlow,
    hasPendingNavigation: Boolean(pendingNavigation),
    isSendingOtp: isOtpSending,
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
