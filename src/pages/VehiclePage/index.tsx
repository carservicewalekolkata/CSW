import { Helmet } from 'react-helmet-async';

const VehiclePage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Vehicles</title>
        <meta
          name="description"
          content="Add, edit, and manage your garage of cars and bikes for personalised service reminders."
        />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">My Vehicles</h1>
        <p className="mt-4 text-lg text-slate-600">Vehicle portfolio components will be included here.</p>
      </div>
    </>
  );
};

export default VehiclePage;
