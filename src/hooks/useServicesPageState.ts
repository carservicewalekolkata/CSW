import { useEffect, useMemo, useState } from 'react';

import type { ServiceCatalog, ServicePricing, ServiceWithMetadata } from '@/hooks/useServiceCatalog';
import type { VehicleModel } from '@/store/vehicleStore';
import { matchVehicleSlug } from '@/utils/vehicleSlug';

import { normalizeCategoryKey } from '@/utils/normalizeCategoryKey';
import type { CategoryFilter, VehicleRouteState, VehicleSelection } from '@/types/servicePageUtilTypes';

export interface UseServicesPageStateParams {
  catalog: ServiceCatalog | undefined;
  isCatalogLoading: boolean;
  vehicleSlug?: string;
  routeState?: VehicleRouteState;
  currentCityName: string;
  modelsByBrand: Record<string, VehicleModel[]>;
  hasLoadedVehicleCatalog: boolean;
  isLoadingVehicleCatalog: boolean;
  fetchVehicleCatalog: () => Promise<void>;
}

export interface ServicesPageState {
  metaTitle: string;
  metaDescription: string;
  heroTitle: string;
  heroDescription: string;
  vehicleBadge: string | null;
  packagesTitle: string;
  packagesDescription: string;
  categoryFilters: CategoryFilter[];
  activeCategoryKey: string | null;
  handleCategorySelect: (key: string | null) => void;
  showCategoryFilters: boolean;
  showLoadingState: boolean;
  vehicleNotFound: boolean;
  displayServices: ServiceWithMetadata[];
  emptyState: { heading: string; description: string } | null;
  vehicleSelection: VehicleSelection | null;
}

export const useServicesPageState = ({
  catalog,
  isCatalogLoading,
  vehicleSlug,
  routeState,
  currentCityName,
  modelsByBrand,
  hasLoadedVehicleCatalog,
  isLoadingVehicleCatalog,
  fetchVehicleCatalog
}: UseServicesPageStateParams): ServicesPageState => {
  useEffect(() => {
    if (!hasLoadedVehicleCatalog && !isLoadingVehicleCatalog) {
      void fetchVehicleCatalog();
    }
  }, [fetchVehicleCatalog, hasLoadedVehicleCatalog, isLoadingVehicleCatalog]);

  const services = useMemo(() => catalog?.services ?? [], [catalog]);
  const allModels = useMemo<VehicleModel[]>(
    () => Object.values(modelsByBrand).flatMap((list) => list),
    [modelsByBrand]
  );

  const slugMatch = useMemo(() => matchVehicleSlug(vehicleSlug, allModels), [vehicleSlug, allModels]);
  const stateMatch = useMemo(() => {
    if (!routeState?.selectedBrandSlug || !routeState?.selectedModelSlug) {
      return null;
    }

    const model = allModels.find(
      (item) => item.brandSlug === routeState.selectedBrandSlug && item.slug === routeState.selectedModelSlug
    );

    if (!model) {
      return null;
    }

    const fuelType = routeState.selectedFuelType ?? model.fuelTypes[0] ?? '';
    if (!fuelType) {
      return null;
    }

    return {
      model,
      fuelType
    };
  }, [routeState, allModels]);

  const vehicleSelection = slugMatch ?? stateMatch ?? null;
  const isVehicleRoute = Boolean(vehicleSlug);
  const isVehicleDataLoading = isVehicleRoute && !vehicleSelection && (!hasLoadedVehicleCatalog || isLoadingVehicleCatalog);

  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

  useEffect(() => {
    if (vehicleSelection) {
      setActiveCategoryKey(null);
    }
  }, [vehicleSelection]);

  const servicesById = useMemo(() => {
    const map = new Map<string, ServiceWithMetadata>();
    services.forEach((service) => {
      map.set(service.id, service);
    });
    return map;
  }, [services]);

  const vehicleScopedServices = useMemo(() => {
    if (!vehicleSelection) {
      return null;
    }

    const scoped = vehicleSelection.model.services
      .map((serviceLink) => {
        const serviceData = servicesById.get(serviceLink.services_id);
        if (!serviceData) {
          return null;
        }

        const pricing: ServicePricing = {
          discount: Number.isFinite(serviceLink.discount) ? serviceLink.discount : 0,
          original_price: Number.isFinite(serviceLink.original_price) ? serviceLink.original_price : 0,
          discount_price: Number.isFinite(serviceLink.discount_price) ? serviceLink.discount_price : 0
        };

        return {
          ...serviceData,
          pricing
        };
      })
      .filter((service): service is ServiceWithMetadata & { pricing: ServicePricing } => service !== null);

    return scoped;
  }, [vehicleSelection, servicesById]);

  const categoryFilters = useMemo<CategoryFilter[]>(() => {
    const collected = new Map<string, string>();

    (catalog?.categories ?? []).forEach((category) => {
      const label = category.name?.trim();
      if (!label) {
        return;
      }
      const key = normalizeCategoryKey(label);
      if (!key || collected.has(key)) {
        return;
      }
      collected.set(key, label);
    });

    if (collected.size === 0 && vehicleScopedServices) {
      vehicleScopedServices.forEach((service) => {
        const label = service.category_name?.trim();
        if (!label) {
          return;
        }
        const key = normalizeCategoryKey(label);
        if (!key || collected.has(key)) {
          return;
        }
        collected.set(key, label);
      });
    }

    return Array.from(collected.entries()).map(([key, label]) => ({ key, label }));
  }, [catalog, vehicleScopedServices]);

  useEffect(() => {
    if (activeCategoryKey && !categoryFilters.some((category) => category.key === activeCategoryKey)) {
      setActiveCategoryKey(null);
    }
  }, [categoryFilters, activeCategoryKey]);

  const generalFilteredServices = useMemo(() => {
    if (!activeCategoryKey) {
      return services;
    }
    return services.filter(
      (service) => normalizeCategoryKey(service.category_name ?? '') === activeCategoryKey
    );
  }, [services, activeCategoryKey]);

  const vehicleFilteredServices = useMemo(() => {
    if (!vehicleSelection) {
      return null;
    }
    const base = vehicleScopedServices ?? [];
    if (!activeCategoryKey) {
      return base;
    }
    return base.filter(
      (service) => normalizeCategoryKey(service.category_name ?? '') === activeCategoryKey
    );
  }, [vehicleSelection, vehicleScopedServices, activeCategoryKey]);

  const displayServices = vehicleFilteredServices ?? generalFilteredServices;
  const vehicleNotFound = isVehicleRoute && !vehicleSelection && !isVehicleDataLoading;
  const showCategoryFilters = !vehicleNotFound;
  const showLoadingState = isCatalogLoading || isVehicleDataLoading;

  const vehicleHeading = vehicleSelection
    ? `${vehicleSelection.fuelType} ${vehicleSelection.model.brandName} ${vehicleSelection.model.name}`
    : null;

  const metaTitle = vehicleSelection
    ? `Car Service Wale | ${vehicleSelection.model.brandName} ${vehicleSelection.model.name} Services`
    : 'Car Service Wale | Services';

  const heroTitle = vehicleHeading ? `Services for ${vehicleHeading}` : 'Services we provide';
  const heroDescription = vehicleHeading
    ? `Curated maintenance, detailing, and repair packages tailored for your ${vehicleHeading}.`
    : `Multiple options to choose, service anytime anywhere in ${currentCityName}. Our advisors craft the right combination of periodic maintenance, repairs, and detailing for every vehicle.`;

  const metaDescription = vehicleHeading
    ? `Discover workshop-grade servicing options for your ${vehicleHeading} in ${currentCityName}.`
    : 'Browse doorstep car servicing, maintenance packages, emergency support, and smart add-ons tailored for your vehicle.';

  const packagesTitle = vehicleHeading
    ? 'Recommended packages for your vehicle'
    : 'Service packages crafted for Indian road conditions';
  const packagesDescription = vehicleHeading
    ? `Every package listed below is compatible with your ${vehicleHeading}.`
    : 'Pick a package or customise your own. All services include 40+ point inspection, transparent job cards, and complimentary pick-up & drop.';

  const emptyState = !showLoadingState && !vehicleNotFound && displayServices.length === 0
    ? {
        heading: vehicleSelection
          ? 'No services listed for this vehicle yet'
          : activeCategoryKey
          ? 'No services in this category yet'
          : 'Service catalogue coming online soon',
        description: vehicleSelection
          ? 'We are syncing the service catalogue for this vehicle. Please check back soon or reach out to our advisors for assistance.'
          : activeCategoryKey
          ? 'We are adding services under this category for your city. Please explore another category or check back soon.'
          : 'Our team is syncing the live service catalogue for your city. Please check back shortly or reach out to our advisors for assistance.'
      }
    : null;

  return {
    metaTitle,
    metaDescription,
    heroTitle,
    heroDescription,
    vehicleBadge: vehicleHeading,
    packagesTitle,
    packagesDescription,
    categoryFilters,
    activeCategoryKey,
    handleCategorySelect: setActiveCategoryKey,
    showCategoryFilters,
    showLoadingState,
    vehicleNotFound,
    displayServices,
    emptyState,
    vehicleSelection
  };
};
