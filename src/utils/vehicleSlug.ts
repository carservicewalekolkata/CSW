import type { VehicleModel } from '@/store/vehicleStore';
import { slugifySegment } from './slug';

export const buildVehicleSlug = (fuelType: string, brandSlug: string, modelSlug: string) => {
  const fuelSegment = slugifySegment(fuelType);
  const brandSegment = slugifySegment(brandSlug);
  const modelSegment = slugifySegment(modelSlug);
  return `${fuelSegment}-${brandSegment}-${modelSegment}-services`;
};

export const buildVehiclePath = (fuelType: string, brandSlug: string, modelSlug: string) =>
  `/services/${buildVehicleSlug(fuelType, brandSlug, modelSlug)}`;

export const matchVehicleSlug = (
  slug: string | undefined,
  models: VehicleModel[]
): { model: VehicleModel; fuelType: string } | null => {
  if (!slug || !slug.endsWith('-services')) {
    return null;
  }

  const normalizedSlug = slug.toLowerCase();

  for (const model of models) {
    for (const fuelType of model.fuelTypes) {
      const candidate = buildVehicleSlug(fuelType, model.brandSlug, model.slug);
      if (candidate === normalizedSlug) {
        return { model, fuelType };
      }
    }
  }

  return null;
};
