import { APIEndpoints } from '@/APIEndpoints';
import { apiRequest } from '@/lib/apiClient';
import type { CustomerActivityRequest, CustomerActivityResponse } from '@/types/customerActivity';

export const logCustomerActivity = (payload: CustomerActivityRequest) =>
  apiRequest<CustomerActivityResponse>({
    endpoint: APIEndpoints.activity.customers,
    method: 'POST',
    data: payload
  });
