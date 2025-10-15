import { Link } from 'react-router-dom';

export const VehicleNotFoundNotice = () => (
  <section className="py-20">
    <div className="container-cs">
      <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-800">
        <h2 className="text-xl font-semibold">We couldn&apos;t find that vehicle</h2>
        <p className="mt-2 text-sm">
          Please reselect your brand, model, and fuel type on the home page to view the relevant services.
        </p>
        <Link
          to="/"
          className="mt-4 inline-flex items-center justify-center rounded-md border border-amber-300 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          Go back to selection
        </Link>
      </div>
    </div>
  </section>
);
