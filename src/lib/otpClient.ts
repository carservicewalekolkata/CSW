import { APIEndpoints } from '@/APIEndpoints';
import { apiRequest } from '@/lib/apiClient';

export type SendOtpResponse = {
  requestId: string;
  expiresAt: string;
};

export const requestOtpCode = (phone: string) =>
  apiRequest<SendOtpResponse>({
    endpoint: APIEndpoints.auth.sendOtp,
    method: 'POST',
    data: { phone }
  });

export type VerifyOtpResponse = {
  requestId: string;
  phone: string;
  expiresAt: string;
  verifiedAt: string;
  attemptsRemaining: number;
};

export const verifyOtpCode = (payload: { requestId: string; phone: string; otp: string }) =>
  apiRequest<VerifyOtpResponse>({
    endpoint: APIEndpoints.auth.verifyOtp,
    method: 'POST',
    data: payload
  });
