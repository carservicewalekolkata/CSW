/**
 * Centralized API Endpoint Configuration
 * For Next.js admin + backend hosted on https://control.carservicewale.com
 */

const DEFAULT_BACKEND_URL = 'https://control.carservicewale.com/api';

// Use environment variable from Azure, fallback to default
const backendUrl = (process.env.VITE_BACKEND_URL || DEFAULT_BACKEND_URL).replace(/\/$/, '');

// Derive origin for asset URLs (optional, but useful)
let backendOrigin: string;
try {
  backendOrigin = new URL(backendUrl).origin;
} catch {
  backendOrigin = backendUrl;
}

// ----- API Version and Routes -----
const API_VERSION = 'v1';

export const APIEndpoints = {
  BackendURL: backendUrl,
  BackendOrigin: backendOrigin,

  auth: {
    login: `${API_VERSION}/auth/login`,
    logout: `${API_VERSION}/auth/logout`,
    refresh: `${API_VERSION}/auth/refresh`,
    status: `${API_VERSION}/auth/status`,
    forgotPassword: `${API_VERSION}/auth/forgot-password`,
  },

  admin: {
    superUser: `${API_VERSION}/admin/super-user`,
  },

  services: {
    details: `${API_VERSION}/services/details`,
    categories: `${API_VERSION}/services/service-category`,
  },

  cars: {
    brands: `${API_VERSION}/cars/brands`,
    models: `${API_VERSION}/cars/models`,
    brandIcon: (iconId: string) => `${API_VERSION}/cars/brands/icon/${iconId}`,
    modelIcon: (iconId: string) => `${API_VERSION}/cars/models/icon/${iconId}`,
  },
} as const;

export type ApiEndpointConfig = typeof APIEndpoints;
