const DEFAULT_BACKEND_URL = 'https://control.carservicewale.com/api';

const envBackendUrl =
  (typeof import.meta !== 'undefined' ? (import.meta.env?.VITE_BACKEND_URL as string | undefined) : undefined) ??
  (typeof process !== 'undefined' ? process.env?.VITE_BACKEND_URL ?? process.env?.BACKEND_URL : undefined);

const normalizedBackendUrl = (envBackendUrl ?? DEFAULT_BACKEND_URL).replace(/\/$/, '');

let backendOrigin = normalizedBackendUrl;
try {
  backendOrigin = new URL(normalizedBackendUrl).origin;
} catch {
  backendOrigin = normalizedBackendUrl;
}

const apiVersion = '/v1';
const apiPrefix = `${apiVersion}`;
const servicesBasePath = `${apiPrefix}/services`;
const carsBasePath = `${apiPrefix}/cars`;
const authBasePath = `${apiVersion}/auth`;
const adminBasePath = `${apiVersion}/admin`;

export const APIEndpoints = {
  BackendURL: normalizedBackendUrl,
  BackendOrigin: backendOrigin,

  auth: {
    login: `${authBasePath}/login`,
    logout: `${authBasePath}/logout`,
    refresh: `${authBasePath}/refresh`,
    status: `${authBasePath}/status`,
    forgotPassword: `${authBasePath}/forgot-password`
  },

  admin: {
    superUser: `${adminBasePath}/super-user`
  },

  services: {
    details: `${servicesBasePath}/details`,
    categories: `${servicesBasePath}/service-category`
  },

  cars: {
    brands: `${carsBasePath}/brands`,
    models: `${carsBasePath}/models`,
    brandIcon: (iconId: string) => `/api${carsBasePath}/brands/icon/${iconId}`,
    modelIcon: (iconId: string) => `/api${carsBasePath}/models/icon/${iconId}`
  }
} as const;

export type ApiEndpointConfig = typeof APIEndpoints;
