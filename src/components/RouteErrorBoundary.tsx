import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom';

const RouteErrorBoundary = () => {
  const error = useRouteError();
  let title = 'Something went wrong';
  let message = 'Please try again or go back to the homepage.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`;
    // @ts-expect-error router error data may be any
    message = error.data?.message || message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <section className="min-h-[60vh] bg-slate-50 py-12">
      <div className="container-cs max-w-3xl">
        <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-card">
          <h1 className="text-xl font-semibold text-red-700">{title}</h1>
          <p className="mt-2 text-sm text-red-600">{message}</p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/" className="btn-primary">Go Home</Link>
            <button type="button" onClick={() => location.reload()} className="btn-secondary">
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RouteErrorBoundary;

