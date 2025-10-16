export const STEP_SEQUENCE = ['brand', 'model', 'fuel'] as const;
export type StepKey = (typeof STEP_SEQUENCE)[number];
export type SelectorStep = StepKey | null;

export const FUEL_ICON_MAP: Record<string, string> = {
  petrol: '/images/icons/general/petrol.png',
  diesel: '/images/icons/general/gasoline.png',
  cng: '/images/icons/general/gas-station.png',
  lpg: '/images/icons/general/gas-station.png',
  electric: '/images/icons/general/mobile.svg',
  hybrid: '/images/icons/general/plan.svg'
};

export const PHONE_NUMBER_PATTERN = /^\d{10}$/;
export const MOCK_OTP_CODE = '1234';
export const OTP_LENGTH = 4;

export const SESSION_TOKEN_STORAGE_KEY = 'csw_customer_session_token';
export const SESSION_PHONE_STORAGE_KEY = 'csw_customer_session_phone';
