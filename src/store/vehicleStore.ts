import { create } from 'zustand';

import { APIEndpoints } from '@/APIEndpoints';
import { apiRequest, resolveBackendAssetUrl } from '@/lib/apiClient';
import type { Brand, BrandResponse, Model, ModelResponse } from '@/types/api';

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

const normalizeBrands = (brands: BrandResponse['data']): VehicleBrand[] =>
  (brands ?? [])
    .filter((brand: Brand) => brand.status)
    .map((brand) => ({
      name: brand.name.trim(),
      slug: brand.slug,
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

const normalizeModels = (models: ModelResponse['data'], brandLookup: Map<string, VehicleBrand>): VehicleModel[] =>
  (models ?? [])
    .filter((model: Model) => model.status)
    .map((model) => {
      const brandKey = (model.brand_name ?? '').trim().toLowerCase();
      const brand = brandLookup.get(brandKey);

      if (!brand) {
        return null;
      }

      return {
        id: model.id,
        name: model.name.trim(),
        slug: model.slug,
        brandName: model.brand_name ?? brand.name,
        brandSlug: brand.slug,
        fuelTypes: normalizeFuelTypes(model.fuel_type),
        thumbnailUrl: resolveBackendAssetUrl(model.thumbnail ?? model.image)
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
      const [brandResponse, modelResponse] = await Promise.all([
        apiRequest<BrandResponse>({
          endpoint: buildEndpoint(APIEndpoints.cars.brands, {
            sortStatus: 'active-first',
            sortUpdated: 'desc',
            limit: 200
          })
        }),
        apiRequest<ModelResponse>({
          endpoint: buildEndpoint(APIEndpoints.cars.models, {
            sortStatus: 'active-first',
            sortUpdated: 'desc',
            limit: 500
          })
        })
      ]);

      if (!brandResponse.success) {
        throw new Error(brandResponse.message ?? 'Unable to fetch car brands.');
      }

      if (!modelResponse.success) {
        throw new Error(modelResponse.message ?? 'Unable to fetch car models.');
      }

      const normalizedBrands = normalizeBrands(brandResponse.data);
      const brandLookup = createBrandLookup(normalizedBrands);
      const normalizedModels = normalizeModels(modelResponse.data, brandLookup);
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
