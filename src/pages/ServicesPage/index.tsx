import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useParams } from 'react-router-dom';

import { serviceFaq } from '@/data/services';
import { useServiceCatalog } from '@/hooks/useServiceCatalog';
import { useAppStore } from '@/store/appStore';
import { useVehicleStore } from '@/store/vehicleStore';

import { CategoryFilters } from './CategoryFilters';
import { ServicePackages } from './ServicePackages';
import { ServicesHero } from './ServicesHero';
import { VehicleNotFoundNotice } from './VehicleNotFoundNotice';
import { useServicesPageState } from '@/hooks/useServicesPageState';
import type { VehicleRouteState } from '@/types/servicePageUtilTypes';

const defaultHeroImage = '/images/hero/service-image.jpg';

const ServicesPage = () => {
  const { currentCity } = useAppStore();
  const { data: catalog, isLoading, isError, error } = useServiceCatalog();
  const { vehicleSlug } = useParams<{ vehicleSlug?: string }>();
  const location = useLocation();
  const routeState = (location.state as VehicleRouteState | undefined) ?? undefined;
  const { modelsByBrand, fetchVehicleCatalog, hasLoadedCatalog, isLoadingCatalog } = useVehicleStore((state) => ({
    modelsByBrand: state.modelsByBrand,
    fetchVehicleCatalog: state.fetchVehicleCatalog,
    hasLoadedCatalog: state.hasLoadedCatalog,
    isLoadingCatalog: state.isLoadingCatalog
  }));

  const {
    metaTitle,
    metaDescription,
    heroTitle,
    heroDescription,
    vehicleBadge,
    packagesTitle,
    packagesDescription,
    categoryFilters,
    activeCategoryKey,
    handleCategorySelect,
    showCategoryFilters,
    showLoadingState,
    vehicleNotFound,
    displayServices,
    emptyState
  } = useServicesPageState({
    catalog,
    isCatalogLoading: isLoading,
    vehicleSlug,
    routeState,
    currentCityName: currentCity.name ?? 'your city',
    modelsByBrand,
    hasLoadedVehicleCatalog: hasLoadedCatalog,
    isLoadingVehicleCatalog: isLoadingCatalog,
    fetchVehicleCatalog
  });

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <ServicesHero title={heroTitle} description={heroDescription} badge={vehicleBadge} />

      <section className="bg-white py-16">
        <div className="container-cs">
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-indigo-950">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-indigo-950">Services</li>
            </ol>
          </nav>
        </div>
      </section>

      {showCategoryFilters && (
        <CategoryFilters
          filters={categoryFilters}
          activeKey={activeCategoryKey}
          onSelect={handleCategorySelect}
          isLoading={showLoadingState}
        />
      )}

      {vehicleNotFound && <VehicleNotFoundNotice />}

      {showLoadingState && (
        <section className="py-20">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </section>
      )}

      {isError && (
        <section className="py-20">
          <div className="container-cs">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
              <h2 className="text-xl font-semibold">We could not load the service catalogue.</h2>
              <p className="mt-2 text-sm">{error instanceof Error ? error.message : 'Something went wrong.'}</p>
            </div>
          </div>
        </section>
      )}

      <ServicePackages
        services={displayServices}
        title={packagesTitle}
        description={packagesDescription}
        defaultHeroImage={defaultHeroImage}
        emptyState={emptyState}
      />

      <section className="bg-white py-20">
        <div className="container-cs grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-indigo-950">How service scheduling works</h2>
            <ol className="space-y-4 text-sm text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <strong className="text-indigo-950">1. Share vehicle details:</strong> Pick your model, fuel type, and
                service goals. We auto-create a checklist tailored to your car.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <strong className="text-indigo-950">2. Approve estimates:</strong> Receive an itemised quote with parts
                &amp; labour. Clarify over call or WhatsApp before approving.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <strong className="text-indigo-950">3. Track live updates:</strong> Stay informed with technician notes,
                pictures, and videos right from the workshop floor.
              </li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <strong className="text-indigo-950">4. Seamless delivery:</strong> Pay online, via UPI, or card. We drop
                the vehicle back, sanitised and test-driven.
              </li>
            </ol>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <h3 className="text-2xl font-semibold text-indigo-950">Frequently Asked Questions</h3>
            <div className="mt-6 space-y-6">
              {serviceFaq.map((item) => (
                <div key={item.question} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
                  <h4 className="text-lg font-semibold text-indigo-950">{item.question}</h4>
                  <p className="mt-2 text-sm text-slate-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ServicesPage;
