import type { ReactNode } from 'react';

import { STEP_SEQUENCE, type SelectorStep, type StepKey } from '@/constants/homepageHeroSectionData';

interface SelectionSheetProps {
  isOpen: boolean;
  activeStep: SelectorStep;
  currentTitle: string;
  currentSubtitle: string;
  onBack: () => void;
  onClose: () => void;
  renderStep: (step: StepKey) => ReactNode;
}

const SelectionSheet = ({
  isOpen,
  activeStep,
  currentTitle,
  currentSubtitle,
  onBack,
  onClose,
  renderStep
}: SelectionSheetProps) => {
  const stepWidthPercent = 100 / STEP_SEQUENCE.length;
  const totalWidthPercent = STEP_SEQUENCE.length * 100;
  const activeIndex = activeStep ? STEP_SEQUENCE.indexOf(activeStep) : 0;

  return (
    <div
      className={`absolute inset-0 z-20 overflow-hidden rounded-md bg-white transition-all duration-300 ease-out ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      } ${isOpen ? 'translate-y-0' : 'translate-y-4'}`}
      aria-hidden={!isOpen}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-[#dbe7f5] px-5 py-4">
          <button
            type="button"
            onClick={onBack}
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
            onClick={onClose}
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
              <section key={step} className="h-full shrink-0 overflow-y-auto px-5 py-5" style={{ width: `${stepWidthPercent}%` }}>
                {renderStep(step)}
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSheet;
