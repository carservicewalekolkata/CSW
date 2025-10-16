import type { ClipboardEvent, KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';

import { MOCK_OTP_CODE, OTP_LENGTH } from '@/constants/homepageHeroSectionData';

interface OtpModalProps {
  isOpen: boolean;
  trimmedPhone: string;
  digits: string[];
  error: string;
  isVerifying: boolean;
  onClose: () => void;
  onDigitChange: (value: string, index: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>, index: number) => void;
  onPaste: (event: ClipboardEvent<HTMLInputElement>) => void;
  onVerify: () => void;
  setInputRef: (index: number, element: HTMLInputElement | null) => void;
}

const OtpModal = ({
  isOpen,
  trimmedPhone,
  digits,
  error,
  isVerifying,
  onClose,
  onDigitChange,
  onKeyDown,
  onPaste,
  onVerify,
  setInputRef
}: OtpModalProps) => {
  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-[#031135]/80 px-4" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-[#6c74a0] transition hover:bg-[#eef6ff] hover:text-[#0285CE]"
          aria-label="Close OTP popup"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold text-[#2a1454]">Verify OTP</h3>
        <p className="mt-2 text-sm text-[#6c74a0]">
          Enter the {OTP_LENGTH}-digit code sent to {trimmedPhone || 'your phone number'}. Use {MOCK_OTP_CODE} to continue for now.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => setInputRef(index, element)}
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(event) => onDigitChange(event.currentTarget.value, index)}
              onKeyDown={(event) => onKeyDown(event, index)}
              onPaste={onPaste}
              className="h-12 w-12 rounded-lg border border-[#dbe7f5] text-center text-lg font-semibold tracking-[0.2em] text-[#2a1454] focus:border-[#0285CE] focus:outline-none focus:ring-2 focus:ring-[#D6F0FF]"
              aria-label={`OTP digit ${index + 1}`}
            />
          ))}
        </div>
        {error && <p className="mt-4 text-xs font-medium text-center text-red-500">{error}</p>}
        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-[#dbe7f5] px-4 py-3 text-sm font-semibold text-[#2a1454] transition hover:border-[#0285CE] hover:text-[#0285CE]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onVerify}
            disabled={isVerifying}
            className="flex-1 rounded-md bg-[#00AEEF] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_10px_25px_rgba(2,150,228,0.25)] transition hover:bg-[#0285CE] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isVerifying ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default OtpModal;
