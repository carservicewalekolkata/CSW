import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FiTrash2 } from 'react-icons/fi';

import { useAppStore, type CartServiceItem } from '@/store/appStore';

const ADMIN_API_BASE_URL = import.meta.env.VITE_ADMIN_API_BASE_URL ?? 'http://localhost:3000';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

type ConfirmModalProps = {
  isOpen: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  subtotal: number;
  taxes: number;
  total: number;
  isProcessing: boolean;
};

const ConfirmBookingModal = ({ isOpen, onConfirm, onCancel, subtotal, taxes, total, isProcessing }: ConfirmModalProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h3 className="text-2xl font-semibold text-indigo-950">Confirm booking</h3>
        <p className="mt-2 text-sm text-slate-600">We will notify an advisor right away to call and schedule pickup.</p>
        <dl className="mt-6 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <dt>Subtotal</dt>
            <dd className="font-semibold text-indigo-900">₹{subtotal.toLocaleString('en-IN')}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt>GST (18%)</dt>
            <dd className="font-semibold text-indigo-900">₹{taxes.toLocaleString('en-IN')}</dd>
          </div>
          <div className="flex items-center justify-between text-base font-semibold text-indigo-950">
            <dt>Total payable</dt>
            <dd>₹{total.toLocaleString('en-IN')}</dd>
          </div>
        </dl>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            disabled={isProcessing}
          >
            Back
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isProcessing}
          >
            {isProcessing ? 'Booking…' : 'Confirm & notify advisor'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const {
    cartItemsDetailed,
    cartItems,
    removeServiceFromCart,
    resetCart,
    customerPhone,
    setCustomerPhone,
    cartStage,
    completeBooking,
    orders
  } = useAppStore();

  const [phoneInput, setPhoneInput] = useState(customerPhone ?? '');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    setPhoneInput(customerPhone ?? '');
  }, [customerPhone]);

  const subtotal = useMemo(
    () => cartItemsDetailed.reduce((acc, item) => acc + item.price, 0),
    [cartItemsDetailed]
  );
  const taxes = subtotal * 0.18;
  const total = subtotal + taxes;

  const handlePhoneSave = () => {
    if (!/^[0-9]{10}$/.test(phoneInput.trim())) {
      setPhoneError('Enter a valid 10-digit mobile number.');
      return;
    }
    setPhoneError(null);
    setCustomerPhone(phoneInput.trim());
  };

  const mapServiceToVehicle = (item: CartServiceItem) => ({
    brandSlug: slugify(item.category || 'service'),
    brandName: item.category || 'Service',
    modelSlug: slugify(item.name),
    modelName: item.name,
    fuelType: item.timeTaken ?? 'service'
  });

  const handleConfirmBooking = async () => {
    if (!customerPhone || cartItemsDetailed.length === 0) {
      return;
    }
    setSubmissionError(null);
    setIsSubmitting(true);
    try {
      const primary = cartItemsDetailed[0];
      const response = await fetch(`${ADMIN_API_BASE_URL}/api/v1/activity/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: customerPhone,
          vehicle: mapServiceToVehicle(primary),
          cartStatus: 'hold',
          cartItems: cartItemsDetailed.map((item) => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: item.price,
            quantity: 1
          })),
          previousQueries: cartItemsDetailed.map((item) => `Interested in ${item.name}`)
        })
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? 'Failed to create lead');
      }
      completeBooking({ phone: customerPhone, items: cartItemsDetailed, total });
      setIsConfirmModalOpen(false);
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Unable to notify advisors. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookNowClick = () => {
    if (!customerPhone) {
      setPhoneError('Please add a phone number before booking.');
      return;
    }
    if (cartItemsDetailed.length === 0) {
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const renderCTA = () => {
    if (cartStage === 'confirmed') {
      return (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Thanks! Your booking is with our advisors now.
        </p>
      );
    }

    return (
      <button
        type="button"
        onClick={handleBookNowClick}
        className="btn-primary w-full justify-center bg-brand-500 text-white hover:bg-brand-600"
      >
        Book now
      </button>
    );
  };

  return (
    <>
      <Helmet>
        <title>Car Service Wale | Cart</title>
        <meta name="description" content="Manage spare parts and service add-ons in your shopping cart before checkout." />
      </Helmet>
      <section className="bg-slate-50 py-20">
        <div className="container-cs grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <h1 className="text-3xl font-bold text-indigo-950">Your Cart</h1>
              <p className="mt-2 text-sm text-slate-600">Add or remove services before notifying our advisors.</p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-0 shadow-card">
              {cartItems === 0 ? (
                <div className="p-6 text-center text-sm text-slate-500">Your cart is empty. Browse services to get started.</div>
              ) : (
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cartItemsDetailed.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt={item.name} className="h-12 w-12 rounded-xl object-cover" loading="lazy" />
                            ) : null}
                            <div>
                              <p className="font-semibold text-indigo-950">{item.name}</p>
                              <p className="text-xs text-slate-500">{item.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-600">₹{item.price.toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => removeServiceFromCart(item.serviceId)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500 hover:border-slate-300"
                          >
                            <FiTrash2 /> Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
              <h2 className="text-xl font-semibold text-indigo-950">Customer contact</h2>
              <p className="mt-2 text-sm text-slate-600">We use this number to associate your cart and notify advisors.</p>
              <div className="mt-4 flex gap-3">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(event) => setPhoneInput(event.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="10-digit mobile number"
                />
                <button
                  type="button"
                  onClick={handlePhoneSave}
                  className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Save
                </button>
              </div>
              {phoneError ? <p className="mt-2 text-xs text-rose-600">{phoneError}</p> : null}
              {customerPhone ? (
                <p className="mt-2 text-xs text-emerald-600">Tracking cart for {customerPhone}</p>
              ) : null}
            </div>

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
              <div className="mt-6 flex flex-col gap-3">
                {renderCTA()}
                {cartStage !== 'confirmed' && cartItems > 0 ? (
                  <button
                    type="button"
                    className="btn-secondary w-full border-brand-500 text-brand-600 hover:bg-brand-50"
                    onClick={() => resetCart()}
                  >
                    Clear cart
                  </button>
                ) : null}
              </div>
              <p className="mt-4 text-xs text-slate-500">
                *Final amount will be confirmed after on-site inspection. No charges until service is confirmed.
              </p>
              {submissionError ? <p className="mt-2 text-xs text-rose-600">{submissionError}</p> : null}
            </div>
          </aside>
          {orders.length > 0 ? (
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card lg:col-span-2">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Recent orders</p>
                  <h3 className="text-xl font-semibold text-indigo-950">Booked service carts</h3>
                </div>
                <p className="text-xs text-slate-500">Showing latest {orders.length} confirmation{orders.length > 1 ? 's' : ''}</p>
              </div>
              <div className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-indigo-950">
                        {order.reference} • {new Date(order.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </p>
                      <p className="text-xs text-slate-500">{order.items.length} service{order.items.length > 1 ? 's' : ''} • ₹{order.total.toLocaleString('en-IN')}</p>
                      <ul className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                        {order.items.map((item) => (
                          <li key={item.id} className="rounded-full bg-slate-50 px-3 py-1">
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-col items-start gap-2 md:items-end">
                      <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {order.status}
                      </span>
                      <a
                        href={`tel:${order.phone}`}
                        className="inline-flex items-center justify-center rounded-full border border-brand-500 px-4 py-2 text-xs font-semibold text-brand-600 transition hover:bg-brand-50"
                      >
                        Call now
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onCancel={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmBooking}
        subtotal={subtotal}
        taxes={taxes}
        total={total}
        isProcessing={isSubmitting}
      />
    </>
  );
};

export default CartPage;
