import { Helmet } from 'react-helmet-async';

const SignupPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Sign Up</title>
        <meta
          name="description"
          content="Create a secure Car Service Wale account to manage vehicles, bookings, and wallet balance."
        />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">Create Account</h1>
        <p className="mt-4 text-lg text-slate-600">Registration forms and OTP flows will be designed here.</p>
      </div>
    </>
  );
};

export default SignupPage;
