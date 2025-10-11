import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Car Service Wale</title>
      </Helmet>
      <div className="container-cs flex min-h-[60vh] flex-col items-center justify-center text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-brand-600">404</span>
        <h1 className="mt-4 text-4xl font-bold">Looks like you are off-route</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600">
          The page you are looking for has been moved or no longer exists. Let us guide you back to the dashboard.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </>
  );
};

export default NotFoundPage;
