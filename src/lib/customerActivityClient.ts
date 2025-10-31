import { APIEndpoints } from '@/APIEndpoints';
import { apiRequest } from '@/lib/apiClient';
import type { CustomerActivityRequest, CustomerActivityResponse } from '@/types/customerActivity';

export const logCustomerActivity = (payload: CustomerActivityRequest) =>
  apiRequest<CustomerActivityResponse>({
    endpoint: APIEndpoints.activity.customers,
    method: 'POST',
    data: payload
  });

export type LatestCartStatus = 'on-cart' | 'booked' | 'solved' | 'cancelled' | null;

export const fetchLatestCartStatus = async (phone: string): Promise<LatestCartStatus> => {
  const data = await apiRequest<{ sessions: Array<{ phone: string; entries: Array<{ createdAt: string; cartStatus: string }> }> }>({
    endpoint: APIEndpoints.activity.customers,
    method: 'GET'
  });

  const sessions = Array.isArray((data as any).sessions) ? (data as any).sessions : [];
  const mine = sessions.find((s) => s.phone === phone);
  if (!mine || !Array.isArray(mine.entries) || mine.entries.length === 0) {
    return null;
  }
  const latest = [...mine.entries].sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))[0];
  const status = String(latest.cartStatus || '').toLowerCase();
  if (status === 'on-cart' || status === 'booked' || status === 'solved' || status === 'cancelled') {
    return status as LatestCartStatus;
  }
  return null;
};
