import { useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { serviceFaq } from '@/data/services';
import { useServiceCatalog } from '@/hooks/useServiceCatalog';
import { useAppStore } from '@/store/appStore';

const ServicesPage = () => {
  const { currentCity } = useAppStore();
  const { data: catalog, isLoading, isError, error } = useServiceCatalog();

  const services = useMemo(() => catalog?.services ?? [], [catalog]);

  const renderPrice = (discountPrice?: number, originalPrice?: number) => {
    if (!discountPrice && !originalPrice) {
      return <p className="text-sm font-semibold text-brand-600">Contact for pricing</p>;
    }

    return (
      <div className="text-right">
        <p className="text-xs uppercase tracking-wider text-slate-400">Starts at</p>
        {discountPrice ? (
          <p className="text-2xl font-bold text-brand-600">₹{discountPrice.toLocaleString('en-IN')}</p>
        ) : null}
        {originalPrice ? (
          <p className="text-xs text-slate-400">MRP ₹{originalPrice.toLocaleString('en-IN')}</p>
        ) : null}
      </div>
    );
  };

  const renderFeatureList = (features: string[]) => {
    if (!features.length) {
      return (
        <p className="text-sm text-slate-600">
          Detailed inclusions for this service are being updated. Our advisor will walk you through the checklist during booking.
        </p>
      );
    }

    return (
      <ul className="grid gap-2 text-sm text-slate-600">
        {features.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 text-brand-600">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  const defaultHeroImage = '/images/hero/service-image.jpg';

  return (
    <>
      <Helmet>
        <title>Car Service Wale | Services</title>
        <meta
          name="description"
          content="Browse doorstep car servicing, maintenance packages, emergency support, and smart add-ons tailored for your vehicle."
        />
      </Helmet>
      <section className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/backgrounds/banner-bg.jpg)' }}>
        <div className="absolute inset-0 bg-indigo-950/75" />
        <div className="container-cs relative z-10 flex flex-col gap-10 py-20 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200/80">Car Service Wale</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Services we provide</h1>
            <p className="text-lg text-white/80">
              Multiple options to choose, service anytime anywhere in {currentCity.name}. Our advisors craft the right combination
              of periodic maintenance, repairs, and detailing for every vehicle.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/bookings" className="btn-primary bg-brand-500 text-white hover:bg-brand-600">
                Schedule a service
              </Link>
              <Link to="/contact" className="btn-secondary border-white/50 text-white hover:border-brand-200 hover:text-brand-200">
                Speak to an advisor
              </Link>
            </div>
          </div>
          <img
            src="/images/hero/service-banner.svg"
            alt="Service banner"
            className="relative z-10 mx-auto w-full max-w-md drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </section>

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

      {isLoading && (
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

      <section className="bg-slate-50 py-20">
        <div className="container-cs space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-indigo-950">Service packages crafted for Indian road conditions</h2>
            <p className="mt-3 text-slate-600">
              Pick a package or customise your own. All services include 40+ point inspection, transparent job cards, and
              complimentary pick-up & drop.
            </p>
          </div>

          {services.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {services.map((service) => {
                const image = service.thumbnailUrl ?? service.serviceImages[0] ?? defaultHeroImage;
                const { pricing } = service;

                return (
                  <article
                    key={service.id}
                    className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-deep"
                  >
                    <div
                      className="h-48 rounded-t-3xl bg-cover bg-center"
                      style={{ backgroundImage: `url(${image})` }}
                      role="presentation"
                    />
                    <div className="flex flex-1 flex-col gap-6 p-8">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-indigo-950">{service.name}</h3>
                          <p className="mt-1 text-xs uppercase tracking-wide text-brand-500">{service.category_name}</p>
                          {service.time_taken ? (
                            <p className="mt-2 text-sm text-slate-500">Approx. time: {service.time_taken}</p>
                          ) : null}
                        </div>
                        {renderPrice(pricing?.discount_price, pricing?.original_price)}
                      </div>
                      {service.description ? (
                        <p className="text-sm text-slate-600">{service.description}</p>
                      ) : (
                        <p className="text-sm text-slate-600">
                          Detailed description for this service will be available soon. Our technician will assist you with the checklist.
                        </p>
                      )}
                      <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">What&apos;s included</p>
                        {renderFeatureList(service.features)}
                      </div>
                      <div className="mt-auto flex flex-col gap-3 text-sm">
                        <button
                          type="button"
                          className="btn-primary w-full justify-center bg-brand-500 text-white hover:bg-brand-600"
                        >
                          Book this service
                        </button>
                        <button
                          type="button"
                          className="btn-secondary w-full justify-center border-brand-500 text-brand-600 hover:bg-brand-50"
                        >
                          Add to compare
                        </button>
                      </div>
                      <p className="text-xs text-slate-400">
                        *Note: Prices are estimates. Final cost may vary after physical inspection and customer approval.
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            !isLoading &&
            !isError && (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-600">
                <h3 className="text-xl font-semibold text-indigo-950">Service catalogue coming online soon</h3>
                <p className="mt-3 text-sm">
                  Our team is syncing the live service catalogue for your city. Please check back shortly or reach out to our advisors for
                  assistance.
                </p>
              </div>
            )
          )}
        </div>
      </section>

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
