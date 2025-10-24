import { useState } from 'react';
import type { ServiceWithMetadata } from '@/hooks/useServiceCatalog';

const renderPrice = (discountPrice?: number, originalPrice?: number) => {
  if (!discountPrice && !originalPrice) {
    return <p className="text-sm font-semibold text-brand-600">Contact for pricing</p>;
  }

  return (
    <div className="text-right">
      {discountPrice ? (
        <p className="text-lg font-bold text-brand-600">₹{discountPrice.toLocaleString('en-IN')}</p>
      ) : null}
      {originalPrice ? (
        <p className="text-xs text-slate-400 line-through">MRP ₹{originalPrice.toLocaleString('en-IN')}</p>
      ) : null}
    </div>
  );
};

const renderFeaturePreview = (features: string[], onReadMore?: () => void) => {
  if (!features.length) {
    return (
      <p className="text-sm text-slate-600">
        Detailed inclusions for this service are being updated. Our advisor will walk you through the checklist during booking.
      </p>
    );
  }

  const previewItems = features.slice(0, 2);

  return (
    <div className="space-y-3">
      <ul className="grid gap-2 text-sm text-slate-600">
        {previewItems.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 text-brand-600">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {features.length > previewItems.length && onReadMore ? (
        <button
          type="button"
          onClick={onReadMore}
          className="text-sm font-semibold text-brand-600 transition hover:text-brand-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          View all inclusions
          <span className="ml-1 text-xs font-medium text-brand-400">(+{features.length - previewItems.length})</span>
        </button>
      ) : null}
    </div>
  );
};

interface ServicePackagesProps {
  services: ServiceWithMetadata[];
  title: string;
  description: string;
  defaultHeroImage: string;
  emptyState: { heading: string; description: string } | null;
}

export const ServicePackages = ({
  services,
  title,
  description,
  defaultHeroImage,
  emptyState
}: ServicePackagesProps) => {
  const [activeService, setActiveService] = useState<ServiceWithMetadata | null>(null);

  const openModal = (service: ServiceWithMetadata) => setActiveService(service);
  const closeModal = () => setActiveService(null);

  return (
    <>
      <section className="bg-slate-50 py-20">
        <div className="container-cs space-y-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-indigo-950">{title}</h2>
            <p className="mt-3 text-slate-600">{description}</p>
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
                        {renderFeaturePreview(
                          service.features,
                          service.features.length > 2 ? () => openModal(service) : undefined
                        )}
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
            emptyState && (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-600">
                <h3 className="text-xl font-semibold text-indigo-950">{emptyState.heading}</h3>
                <p className="mt-3 text-sm">{emptyState.description}</p>
              </div>
            )
          )}
        </div>
      </section>

      {activeService ? (
        <>
          <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-[2px]" onClick={closeModal} />
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-deep">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">Service inclusions</p>
                  <h3 className="mt-2 text-2xl font-semibold text-indigo-950">{activeService.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
                  aria-label="Close details"
                >
                  <span className="text-lg">&times;</span>
                </button>
              </div>
              <div className="mt-6 space-y-4">
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">What&apos;s included</p>
                {activeService.features.length ? (
                  <ul className="grid gap-3 text-sm text-slate-600">
                    {activeService.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="mt-1 h-2 w-2 rounded-full bg-brand-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-600">
                    Detailed inclusions for this service are being updated. Our advisor will walk you through the checklist during booking.
                  </p>
                )}
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2"
                  onClick={closeModal}
                >
                  Book this service
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};
