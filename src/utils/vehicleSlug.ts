import type { VehicleModel } from '@/store/vehicleStore';
import { slugifySegment } from './slug';

const normalizeFuelSegment = (value: string | null | undefined) => {
  if (!value) {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return slugifySegment(trimmed);
};

export const buildVehicleSlug = (brandSlug: string, modelSlug: string, fuelType?: string | null) => {
  const fuelSegment = normalizeFuelSegment(fuelType);
  const brandSegment = slugifySegment(brandSlug);
  const modelSegment = slugifySegment(modelSlug);
  const segments = fuelSegment ? [fuelSegment, brandSegment, modelSegment, 'services'] : [brandSegment, modelSegment, 'services'];
  return segments.join('-');
};

export const buildVehiclePath = (brandSlug: string, modelSlug: string, fuelType?: string | null) =>
  `/services/${buildVehicleSlug(brandSlug, modelSlug, fuelType)}`;

export const matchVehicleSlug = (
  slug: string | undefined,
  models: VehicleModel[]
): { model: VehicleModel; fuelType: string | null } | null => {
  if (!slug || !slug.endsWith('-services')) {
    return null;
  }

  const normalizedSlug = slug.toLowerCase();

  for (const model of models) {
    const baseCandidate = buildVehicleSlug(model.brandSlug, model.slug, null);
    if (baseCandidate === normalizedSlug) {
      return { model, fuelType: null };
    }

    for (const fuelType of model.fuelTypes) {
      const candidate = buildVehicleSlug(model.brandSlug, model.slug, fuelType);
      if (candidate === normalizedSlug) {
        return { model, fuelType };
      }
    }
  }

  return null;
};
