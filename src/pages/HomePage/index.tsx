import { Helmet } from 'react-helmet-async';
import { useEffect } from 'react';
import { useVehicleStore } from '@/store/vehicleStore';
import { useHomeContent, getDefaultHomeContent } from '@/hooks/useHomeContent';
import CostComparisonSection from './CostComparisonSection';
import HeroSection from './HeroSection';
import ServiceSection from './ServiceSection';
import USPSection from './USPSection';
import WhyUsSection from './WhyUsSection';
import TestimonialSection from './TestimonialSection';
import BenefitsSection from './BenefitsSection';
import ProcessSection from './ProcessSection';
import BrandGrid from './BrandGrid';
// Skeletons per section
import ServiceSectionSkeleton from './skeletons/ServiceSectionSkeleton';
import BrandGridSkeleton from './skeletons/BrandGridSkeleton';

const HomePage = () => {
  const { data, isLoading, isError, error } = useHomeContent();
  const content = data ?? getDefaultHomeContent();

  useEffect(() => {
    const { hasLoadedCatalog, isLoadingCatalog, fetchVehicleCatalog } = useVehicleStore.getState();
    if (!hasLoadedCatalog && !isLoadingCatalog) {
      void fetchVehicleCatalog();
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Best Car Service And Repair in Kolkata | Expert Car Service Centre Near Me | CSW</title>
        <meta
          name="description"
          content="Best car service and repair in Kolkata. Expert mechanics, genuine spares, doorstep pickup, and transparent pricing from Car Service Wale (CSW)."
        />
      </Helmet>
      {/* Always render constant sections immediately */}
      {isError && (
        <div className="container-cs py-4">
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-yellow-800">
            <p className="text-sm">We could not load some live data. Showing defaults.</p>
            <p className="text-xs mt-1">{error instanceof Error ? error.message : 'Something went wrong.'}</p>
          </div>
        </div>
      )}
      <HeroSection data={content.hero} />
      <USPSection items={content.usp} />
      {/* Services and Brand logos depend on backend; keep skeletons while loading */}
      {isLoading ? <ServiceSectionSkeleton /> : <ServiceSection data={content.services} />}
      <CostComparisonSection data={content.costComparisons} />
      <WhyUsSection items={content.whyUs} />
      <TestimonialSection items={content.testimonials} />
      <BenefitsSection items={content.benefits} />
      <ProcessSection items={content.process} />
      {isLoading ? <BrandGridSkeleton /> : <BrandGrid logos={content.brandLogos} />}
    </>
  );
};

export default HomePage;
