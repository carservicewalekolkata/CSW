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
}: ServicePackagesProps) => (
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
        emptyState && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-600">
            <h3 className="text-xl font-semibold text-indigo-950">{emptyState.heading}</h3>
            <p className="mt-3 text-sm">{emptyState.description}</p>
          </div>
        )
      )}
    </div>
  </section>
);
