import { create } from 'zustand';

import { APIEndpoints } from '@/APIEndpoints';
import { apiRequest, resolveBackendAssetUrl } from '@/lib/apiClient';
import type { Brand, BrandResponse, Model, ModelResponse, ModelService } from '@/types/api';
import { slugifySegment } from '@/utils/slug';

export interface VehicleBrand {
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface VehicleModel {
  id: number;
  name: string;
  slug: string;
  brandName: string;
  brandSlug: string;
  fuelTypes: string[];
  thumbnailUrl: string | null;
  services: ModelService[];
}

type ModelsByBrand = Record<string, VehicleModel[]>;

interface VehicleState {
  brands: VehicleBrand[];
  modelsByBrand: ModelsByBrand;
  isLoadingCatalog: boolean;
  hasLoadedCatalog: boolean;
  catalogError?: string;
  selectedBrand?: VehicleBrand;
  selectedModel?: VehicleModel;
  selectedFuelType?: string;
  fetchVehicleCatalog: () => Promise<void>;
  selectBrand: (brand: VehicleBrand) => void;
  selectModel: (model: VehicleModel) => void;
  setFuelType: (fuelType: string) => void;
  resetSelection: () => void;
}

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

const normalizeSlugValue = (value: string | null | undefined, fallback: string) => {
  const trimmed = typeof value === 'string' ? value.trim().toLowerCase() : '';
  if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
    return slugifySegment(fallback);
  }
  return slugifySegment(trimmed);
};

const normalizeBrands = (brands: BrandResponse['data']): VehicleBrand[] =>
  (brands ?? [])
    .filter((brand: Brand) => brand.status)
    .map((brand) => ({
      name: brand.name.trim(),
      slug: normalizeSlugValue(brand.slug, brand.name),
      iconUrl: resolveBackendAssetUrl(brand.icon)
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

const createBrandLookup = (brands: VehicleBrand[]) => {
  const lookup = new Map<string, VehicleBrand>();
  brands.forEach((brand) => {
    lookup.set(brand.name.trim().toLowerCase(), brand);
  });
  return lookup;
};

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .split(/\s+/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ''))
    .join(' ')
    .trim();

const normalizeFuelTypes = (fuelTypes: Model['fuel_type']): string[] => {
  const unique = new Set<string>();

  (fuelTypes ?? []).forEach((fuel) => {
    const trimmed = fuel.trim();
    if (!trimmed) {
      return;
    }
    const normalized = toTitleCase(trimmed);
    if (!unique.has(normalized)) {
      unique.add(normalized);
    }
  });

  return Array.from(unique);
};

const normalizeServiceFuelType = (value: string | null | undefined): string | null => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return toTitleCase(trimmed);
};

const normalizeModelServices = (services: Model['services']): ModelService[] => {
  if (!Array.isArray(services)) {
    return [];
  }

  return services
    .map((service) => {
      const serviceId =
        typeof service.services_id === 'string'
          ? service.services_id
          : service.services_id && typeof (service.services_id as { toString?: () => string }).toString === 'function'
          ? (service.services_id as { toString: () => string }).toString()
          : '';

      if (!serviceId) {
        return null;
      }

      return {
        services_id: serviceId,
        fuel_type: normalizeServiceFuelType(service.fuel_type),
        discount: Number.isFinite(service.discount) ? Number(service.discount) : 0,
        original_price: Number.isFinite(service.original_price) ? Number(service.original_price) : 0,
        discount_price: Number.isFinite(service.discount_price) ? Number(service.discount_price) : 0
      } satisfies ModelService;
    })
    .filter((service): service is ModelService => service !== null);
};

const normalizeModels = (models: ModelResponse['data'], brandLookup: Map<string, VehicleBrand>): VehicleModel[] =>
  (models ?? [])
    .filter((model: Model) => model.status)
    .map((model) => {
      const brandKey = (model.brand_name ?? '').trim().toLowerCase();
      const brand = brandLookup.get(brandKey);

      if (!brand) {
        return null;
      }

      const modelSlug = normalizeSlugValue(model.slug, model.name);

      const toPreviewPath = (value: string | null | undefined): string | null => {
        if (typeof value !== 'string') {
          return null;
        }

        const trimmed = value.trim();
        if (!trimmed) {
          return null;
        }

        if (trimmed.startsWith('azure:')) {
          return `/api/v1/cars/models/image/blob/${trimmed.slice('azure:'.length)}`;
        }

        return trimmed;
      };

      const previewPath =
        toPreviewPath(model.image) ?? toPreviewPath(model.thumbnail) ?? toPreviewPath(model.image_path);

      return {
        id: model.id,
        name: model.name.trim(),
        slug: modelSlug,
        brandName: model.brand_name ?? brand.name,
        brandSlug: brand.slug,
        fuelTypes: normalizeFuelTypes(model.fuel_type),
        thumbnailUrl: resolveBackendAssetUrl(previewPath ?? null),
        services: normalizeModelServices(model.services)
      };
    })
    .filter((model): model is VehicleModel => Boolean(model))
    .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

const groupModelsByBrand = (models: VehicleModel[]): ModelsByBrand => {
  const grouped: ModelsByBrand = {};

  models.forEach((model) => {
    if (!grouped[model.brandSlug]) {
      grouped[model.brandSlug] = [];
    }
    grouped[model.brandSlug].push(model);
  });

  return grouped;
};

const MODELS_PAGE_SIZE = 100;
const MAX_MODEL_PAGES = 20;

const fetchFullModelCatalogue = async (): Promise<Model[]> => {
  const modelsById = new Map<number, Model>();
  let total = Number.POSITIVE_INFINITY;
  let page = 1;

  while (modelsById.size < total && page <= MAX_MODEL_PAGES) {
    const response = await apiRequest<ModelResponse>({
      endpoint: buildEndpoint(APIEndpoints.cars.models, {
        sortStatus: 'active-first',
        sortUpdated: 'desc',
        page,
        limit: MODELS_PAGE_SIZE
      })
    });

    if (!response.success) {
      throw new Error(response.message ?? 'Unable to fetch car models.');
    }

    (response.data ?? []).forEach((model) => {
      if (model && typeof model.id === 'number') {
        modelsById.set(model.id, model);
      }
    });

    const fetchedCount = response.data?.length ?? 0;
    total =
      typeof response.total === 'number' && response.total > 0 ? response.total : modelsById.size;

    if (fetchedCount === 0 || modelsById.size >= total) {
      break;
    }

    page += 1;
  }

  if (modelsById.size < total && page > MAX_MODEL_PAGES) {
    console.warn('Reached maximum page limit while fetching car models; some models may be omitted.');
  }

  return Array.from(modelsById.values());
};

export const useVehicleStore = create<VehicleState>((set, get) => ({
  brands: [],
  modelsByBrand: {},
  isLoadingCatalog: false,
  hasLoadedCatalog: false,
  catalogError: undefined,
  selectedBrand: undefined,
  selectedModel: undefined,
  selectedFuelType: undefined,

  fetchVehicleCatalog: async () => {
    const { isLoadingCatalog, hasLoadedCatalog } = get();
    if (isLoadingCatalog || hasLoadedCatalog) {
      return;
    }

    set({ isLoadingCatalog: true, catalogError: undefined });

    try {
      const [brandResponse, modelsData] = await Promise.all([
        apiRequest<BrandResponse>({
          endpoint: buildEndpoint(APIEndpoints.cars.brands, {
            sortStatus: 'active-first',
            sortUpdated: 'desc',
            limit: 200
          })
        }),
        fetchFullModelCatalogue()
      ]);

      if (!brandResponse.success) {
        throw new Error(brandResponse.message ?? 'Unable to fetch car brands.');
      }

      const normalizedBrands = normalizeBrands(brandResponse.data);
      const brandLookup = createBrandLookup(normalizedBrands);
      const normalizedModels = normalizeModels(modelsData, brandLookup);
      const modelsByBrand = groupModelsByBrand(normalizedModels);

      set({
        brands: normalizedBrands,
        modelsByBrand,
        hasLoadedCatalog: true
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load vehicle catalogue.';
      set({ catalogError: message });
    } finally {
      set({ isLoadingCatalog: false });
    }
  },

  selectBrand: (brand) =>
    set((state) => {
      const updatedBrand = state.brands.find((item) => item.slug === brand.slug);

      return {
        selectedBrand: updatedBrand ?? brand,
        selectedModel: undefined,
        selectedFuelType: undefined
      };
    }),

  selectModel: (model) =>
    set((state) => {
      const brandSlug = state.selectedBrand?.slug;

      if (!brandSlug || model.brandSlug !== brandSlug) {
        return state;
      }

      const models = state.modelsByBrand[brandSlug] ?? [];
      const matchedModel = models.find((item) => item.slug === model.slug);

      return {
        ...state,
        selectedModel: matchedModel ?? model,
        selectedFuelType: undefined
      };
    }),

  setFuelType: (fuelType) =>
    set((state) => {
      if (!state.selectedModel) {
        return state;
      }

      return {
        ...state,
        selectedFuelType: fuelType
      };
    }),

  resetSelection: () =>
    set({
      selectedBrand: undefined,
      selectedModel: undefined,
      selectedFuelType: undefined
    })
}));
