import type { VehicleModel } from '@/store/vehicleStore';

export type CategoryFilter = {
  label: string;
  key: string;
};

export type VehicleRouteState = {
  selectedBrandSlug?: string;
  selectedBrandName?: string;
  selectedModelSlug?: string;
  selectedModelName?: string;
  selectedFuelType?: string;
  selectedCategoryId?: number;
  phone?: string;
};

export type VehicleSelection = {
  model: VehicleModel;
  fuelType: string | null;
};
