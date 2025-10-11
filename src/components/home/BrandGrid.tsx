interface BrandGridProps {
  logos: string[];
}

const BrandGrid = ({ logos }: BrandGridProps) => {
  return (
    <section className="bg-white py-20">
      <div className="container-cs space-y-10">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold text-indigo-950">Brands We Serve</h2>
          <p className="mt-3 text-slate-600">
            To help narrow down your search, here are the most popular car brands serviced by our workshop network.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {logos.map((logo, index) => (
            <div
              key={logo}
              className="flex min-h-[100px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-deep"
            >
              <img src={logo} alt={`Brand ${index + 1}`} className="max-h-16" loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandGrid;
