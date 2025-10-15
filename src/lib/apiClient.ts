import { APIEndpoints } from '@/APIEndpoints';

const HTTP_PATTERN = /^https?:\/\//i;

export interface ApiRequestOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  data?: unknown;
  headers?: Record<string, string>;
}

const ensureTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`);

const resolveApiEndpoint = (endpoint: string): string => {
  if (!endpoint) {
    throw new Error('API endpoint is required');
  }

  if (HTTP_PATTERN.test(endpoint)) {
    return endpoint;
  }

  const baseUrl = ensureTrailingSlash(APIEndpoints.BackendURL);

  if (endpoint.startsWith('/')) {
    return `${baseUrl}${endpoint.slice(1)}`;
  }

  return `${baseUrl}${endpoint}`;
};

const resolveBackendOrigin = () => {
  try {
    return new URL(APIEndpoints.BackendURL).origin;
  } catch {
    return APIEndpoints.BackendOrigin;
  }
};

export const resolveBackendAssetUrl = (path?: string | null): string | null => {
  if (!path) {
    return null;
  }

  if (HTTP_PATTERN.test(path)) {
    return path;
  }

  if (path.startsWith('//')) {
    const protocol = APIEndpoints.BackendURL.startsWith('https://') ? 'https:' : 'http:';
    return `${protocol}${path}`;
  }

  if (path.startsWith('/')) {
    return `${resolveBackendOrigin()}${path}`;
  }

  return `${ensureTrailingSlash(APIEndpoints.BackendURL)}${path}`;
};

export async function apiRequest<T>({ endpoint, method = 'GET', data, headers = {} }: ApiRequestOptions): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(resolveApiEndpoint(endpoint), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: controller.signal,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    if (response.status === 204) {
      return null as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
