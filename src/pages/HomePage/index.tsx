import { Helmet } from 'react-helmet-async';
import { useHomeContent } from '@/hooks/useHomeContent';
import CostComparisonSection from './CostComparisonSection';
import HeroSection from './HeroSection';
import ServiceSection from './ServiceSection';
import USPSection from './USPSection';
import WhyUsSection from './WhyUsSection';
import TestimonialSection from './TestimonialSection';
import BenefitsSection from './BenefitsSection';
import ProcessSection from './ProcessSection';
import BrandGrid from './BrandGrid';

const HomePage = () => {
  const { data, isLoading, isError, error } = useHomeContent();

  return (
    <>
      <Helmet>
        <title>Car Service Wale | Home</title>
        <meta
          name="description"
          content="Discover premium on-demand car and bike services, genuine spare parts, and expert care with Car Service Wale."
        />
      </Helmet>
      {isLoading && (
        <div className="py-32">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        </div>
      )}
      {isError && (
        <div className="container-cs py-20">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-red-700">
            <h2 className="text-xl font-semibold">We could not load the homepage content.</h2>
            <p className="mt-2 text-sm">{error instanceof Error ? error.message : 'Something went wrong.'}</p>
          </div>
        </div>
      )}
      {data && (
        <>
          <HeroSection data={data.hero} />
          <USPSection items={data.usp} />
          <ServiceSection data={data.services} />
          <CostComparisonSection data={data.costComparisons} />
          <WhyUsSection items={data.whyUs} />
          <TestimonialSection items={data.testimonials} />
          <BenefitsSection items={data.benefits} />
          <ProcessSection items={data.process} />
          <BrandGrid logos={data.brandLogos} />
        </>
      )}
    </>
  );
};

export default HomePage;
