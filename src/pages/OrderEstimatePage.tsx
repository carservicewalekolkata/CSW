import { Helmet } from 'react-helmet-async';

const OrderEstimatePage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Order Estimate</title>
        <meta
          name="description"
          content="Compare labour, spare parts, and taxes in a transparent order estimate before approving work."
        />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">Order Estimate</h1>
        <p className="mt-4 text-lg text-slate-600">Estimate breakdown UI will be crafted in this section.</p>
      </div>
    </>
  );
};

export default OrderEstimatePage;
