import { Helmet } from 'react-helmet-async';

const LoginPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Login</title>
        <meta name="description" content="Sign in to manage bookings, wallet balance, and personalised recommendations." />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">Welcome Back</h1>
        <p className="mt-4 text-lg text-slate-600">Secure authentication UI will be implemented here.</p>
      </div>
    </>
  );
};

export default LoginPage;
