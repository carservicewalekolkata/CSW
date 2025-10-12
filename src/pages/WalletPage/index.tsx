import { Helmet } from 'react-helmet-async';

const WalletPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Wallet</title>
        <meta
          name="description"
          content="Track wallet balance, cashback, and payment history for secure car service transactions."
        />
      </Helmet>
      <div className="container-cs py-20">
        <h1 className="text-4xl font-bold">Wallet</h1>
        <p className="mt-4 text-lg text-slate-600">Wallet activity and settlements will be shown here.</p>
      </div>
    </>
  );
};

export default WalletPage;
