import { Helmet } from 'react-helmet-async';

const SchedulePickupPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Schedule Pickup</title>
        <meta
          name="description"
          content="Choose doorstep pickup slots, assign drivers, and share instructions for hassle-free servicing."
        />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">Schedule Pickup</h1>
        <p className="mt-4 text-lg text-slate-600">Pickup scheduler and preferences will be added soon.</p>
      </div>
    </>
  );
};

export default SchedulePickupPage;
