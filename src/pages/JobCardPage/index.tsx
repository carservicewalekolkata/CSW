import { Helmet } from 'react-helmet-async';

const JobCardPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Job Card</title>
        <meta
          name="description"
          content="Detailed job cards capture labour, parts, and technician updates for every vehicle service."
        />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">Job Card</h1>
        <p className="mt-4 text-lg text-slate-600">Service diagnostics and technician notes will be ported here.</p>
      </div>
    </>
  );
};

export default JobCardPage;
