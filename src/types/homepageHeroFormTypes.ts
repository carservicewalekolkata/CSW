export type VehicleNavigationState = {
  selectedBrandSlug: string;
  selectedBrandName: string;
  selectedModelSlug: string;
  selectedModelName: string;
  selectedFuelType: string;
  phone: string;
};

export type PendingNavigationState = {
  path: string;
  state: VehicleNavigationState;
};

export type VehiclePayload = {
  brandSlug: string;
  brandName: string;
  modelSlug: string;
  modelName: string;
  fuelType: string;
};
