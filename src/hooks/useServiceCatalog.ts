import { useQuery } from '@tanstack/react-query';

import { APIEndpoints } from '@/APIEndpoints';
import { apiRequest, resolveBackendAssetUrl } from '@/lib/apiClient';
import type {
  Brand,
  BrandResponse,
  ModelResponse,
  ModelService,
  Service,
  ServiceCategory,
  ServiceCategoryResponse,
  ServiceResponse
} from '@/types/api';

export interface ServicePricing {
  discount: number;
  original_price: number;
  discount_price: number;
}

export interface ServiceWithMetadata extends Service {
  thumbnailUrl: string | null;
  serviceImages: string[];
  pricing?: ServicePricing;
}

export interface BrandSummary {
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface ServiceCatalog {
  services: ServiceWithMetadata[];
  categories: ServiceCategory[];
  brands: BrandSummary[];
  pricingByServiceId: Record<string, ServicePricing>;
}

export const serviceCatalogQueryKey = ['service-catalog'] as const;

const buildEndpoint = (path: string, params?: Record<string, string | number | undefined>) => {
  if (!params) {
    return path;
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }
    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `${path}?${queryString}` : path;
};

const createPricingMap = (models: ModelResponse['data']) => {
  const map = new Map<string, ServicePricing>();

  models
    .filter((model) => model.status)
    .forEach((model) => {
      (model.services ?? []).forEach((service: ModelService) => {
        const existing = map.get(service.services_id);

        if (!existing || (service.discount_price > 0 && service.discount_price < existing.discount_price)) {
          map.set(service.services_id, {
            discount: Number.isFinite(service.discount) ? service.discount : 0,
            original_price: Number.isFinite(service.original_price) ? service.original_price : 0,
            discount_price: Number.isFinite(service.discount_price) ? service.discount_price : 0
          });
        }
      });
    });

  return map;
};

const normalizeBrands = (brands: BrandResponse['data']): BrandSummary[] =>
  brands
    .filter((brand: Brand) => brand.status)
    .map((brand) => ({
      name: brand.name,
      slug: brand.slug,
      iconUrl: resolveBackendAssetUrl(brand.icon)
    }))
    .filter((brand) => Boolean(brand.iconUrl));

const normalizeServices = (
  services: ServiceResponse['data'],
  pricing: Map<string, ServicePricing>
): ServiceWithMetadata[] =>
  services
    .filter((service: Service) => service.status)
    .map((service) => {
      const pricingInfo = pricing.get(service.id);
      const thumbnailUrl = resolveBackendAssetUrl(service.thumbnail);
      const serviceImages = (service.service_images ?? [])
        .map((image) => resolveBackendAssetUrl(image))
        .filter((image): image is string => Boolean(image));

      return {
        ...service,
        thumbnailUrl,
        serviceImages,
        pricing: pricingInfo
      };
    });

export const fetchServiceCatalog = async (): Promise<ServiceCatalog> => {
  const [servicesResponse, categoriesResponse, brandsResponse, modelsResponse] = await Promise.all([
    apiRequest<ServiceResponse>({
      endpoint: buildEndpoint(APIEndpoints.services.details, {
        status: 'active',
        sortUpdated: 'desc',
        limit: 100
      })
    }),
    apiRequest<ServiceCategoryResponse>({
      endpoint: buildEndpoint(APIEndpoints.services.categories, {
        sortUpdated: 'desc',
        limit: 100
      })
    }),
    apiRequest<BrandResponse>({
      endpoint: buildEndpoint(APIEndpoints.cars.brands, {
        sortStatus: 'active-first',
        limit: 100
      })
    }),
    apiRequest<ModelResponse>({
      endpoint: buildEndpoint(APIEndpoints.cars.models, {
        sortStatus: 'active-first',
        limit: 100
      })
    }).catch((error: unknown) => {
      console.error('Failed to load model pricing data:', error);
      return {
        success: false,
        count: 0,
        total: 0,
        page: 1,
        limit: 0,
        timestamp: new Date().toISOString(),
        data: [] as ModelResponse['data'],
        message: error instanceof Error ? error.message : 'Unable to load model pricing'
      } satisfies ModelResponse;
    })
  ]);

  if (!servicesResponse.success) {
    throw new Error(servicesResponse.message ?? 'Unable to fetch services from backend.');
  }

  if (!categoriesResponse.success) {
    throw new Error(categoriesResponse.message ?? 'Unable to fetch service categories from backend.');
  }

  if (!brandsResponse.success) {
    throw new Error(brandsResponse.message ?? 'Unable to fetch brand catalogue from backend.');
  }

  const pricingMap = createPricingMap(modelsResponse.data ?? []);
  const normalizedServices = normalizeServices(servicesResponse.data ?? [], pricingMap);
  const normalizedBrands = normalizeBrands(brandsResponse.data ?? []);

  const pricingByServiceId: Record<string, ServicePricing> = {};
  pricingMap.forEach((value, key) => {
    pricingByServiceId[key] = value;
  });

  return {
    services: normalizedServices,
    categories: categoriesResponse.data ?? [],
    brands: normalizedBrands,
    pricingByServiceId
  };
};

export const useServiceCatalog = () =>
  useQuery<ServiceCatalog>({
    queryKey: serviceCatalogQueryKey,
    queryFn: fetchServiceCatalog,
    staleTime: 1000 * 60 * 5
  });
