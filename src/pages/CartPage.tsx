import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAppStore } from '@/store/appStore';

const cartItems = [
  {
    id: 'csw-001',
    name: 'Periodic Maintenance Package',
    description: 'Engine oil, filter replacement, 40-point inspection',
    price: 2091,
    quantity: 1,
    image: '/images/hero/service-image.jpg'
  },
  {
    id: 'csw-002',
    name: 'AC Disinfectant Treatment',
    description: 'Evaporator cleansing and fragrance add-on',
    price: 899,
    quantity: 1,
    image: '/images/icons/services/t-s-6.svg'
  }
];

const CartPage = () => {
  const { setCartItems } = useAppStore();
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxes = subtotal * 0.18;
  const total = subtotal + taxes;

  useEffect(() => {
    const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartItems(totalQuantity);
    return () => setCartItems(0);
  }, [setCartItems]);

  return (
    <>
      <Helmet>
        <title>Car Service Wale | Cart</title>
        <meta
          name="description"
          content="Manage spare parts and service add-ons in your shopping cart before checkout."
        />
      </Helmet>
      <section className="bg-slate-50 py-20">
        <div className="container-cs grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <h1 className="text-3xl font-bold text-indigo-950">Your Cart</h1>
              <p className="mt-2 text-sm text-slate-600">
                Review selected services and add-ons. Adjust quantities or remove items before confirming your booking.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-0 shadow-card">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Service</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Qty</th>
                    <th className="px-6 py-4 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
                          <div>
                            <p className="font-semibold text-indigo-950">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-600">₹{item.price.toLocaleString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-sm font-medium text-slate-600">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-indigo-950">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-indigo-950">Price summary</h2>
              <dl className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <dt>Subtotal</dt>
                  <dd className="font-semibold text-indigo-950">₹{subtotal.toLocaleString('en-IN')}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt>GST (18%)</dt>
                  <dd className="font-semibold text-indigo-950">₹{taxes.toLocaleString('en-IN')}</dd>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-indigo-950">
                  <dt>Total payable</dt>
                  <dd>₹{total.toLocaleString('en-IN')}</dd>
                </div>
              </dl>
              <button type="button" className="btn-primary mt-6 w-full bg-brand-500 text-white hover:bg-brand-600">
                Proceed to checkout
              </button>
              <button type="button" className="btn-secondary mt-3 w-full border-brand-500 text-brand-600 hover:bg-brand-50">
                Continue shopping
              </button>
              <p className="mt-4 text-xs text-slate-500">
                *Final amount will be confirmed after on-site inspection. No charges until service is confirmed.
              </p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="text-lg font-semibold text-indigo-950">Secure payments</h3>
              <p className="mt-3 text-sm text-slate-600">
                Payments are processed via PCI-DSS compliant gateways. We support UPI, credit/debit cards, net banking, and
                wallet settlements.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
};

export default CartPage;
