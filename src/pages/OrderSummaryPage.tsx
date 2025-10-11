import { Helmet } from 'react-helmet-async';

const OrderSummaryPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Order Summary</title>
        <meta
          name="description"
          content="Track completed services, invoices, and payment confirmations within the order summary."
        />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">Order Summary</h1>
        <p className="mt-4 text-lg text-slate-600">Final service details and receipts will be rendered here.</p>
      </div>
    </>
  );
};

export default OrderSummaryPage;
