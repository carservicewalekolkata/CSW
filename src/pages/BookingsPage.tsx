import { Helmet } from 'react-helmet-async';

const bookings = [
  {
    id: '125468',
    vehicle: 'Rolls Royce Wraith',
    fuel: 'Petrol',
    service: 'Regular Service',
    dropDate: '16-06-2023 10:30 PM',
    pickupDate: '17-06-2023 06:00 PM',
    status: 'Booked',
    statusSteps: ['Booked', 'Service in progress', 'Completed']
  },
  {
    id: '225671',
    vehicle: 'Hyundai Creta',
    fuel: 'Diesel',
    service: 'Premium Detailing',
    dropDate: '20-08-2023 09:00 AM',
    pickupDate: '21-08-2023 04:30 PM',
    status: 'Service in progress',
    statusSteps: ['Booked', 'Service in progress', 'Completed']
  }
];

const BookingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Bookings</title>
        <meta
          name="description"
          content="Review upcoming and past service bookings, track technician status, and manage appointments."
        />
      </Helmet>
      <section className="bg-slate-50 py-20">
        <div className="container-cs space-y-10">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl font-bold text-indigo-950">My Bookings</h1>
            <p className="text-slate-600">
              Track active jobs, service milestones, and delivery times. Tap on any booking to view the detailed job card
              and approvals.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              {bookings.map((booking) => (
                <article key={booking.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-sm uppercase tracking-wide text-slate-400">Booking ID</p>
                      <p className="text-xl font-semibold text-indigo-950">#{booking.id}</p>
                    </div>
                    <span className="rounded-full bg-brand-50 px-4 py-1 text-sm font-semibold text-brand-700">
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-4">
                      <img src="/images/m-car.svg" alt={booking.vehicle} className="h-14 w-14" loading="lazy" />
                      <div>
                        <p className="text-base font-semibold text-indigo-950">{booking.vehicle}</p>
                        <p className="text-sm text-slate-500">Fuel: {booking.fuel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <img src="/images/service-image.jpg" alt={booking.service} className="h-14 w-14 rounded-xl object-cover" loading="lazy" />
                      <div>
                        <p className="text-sm font-semibold text-indigo-950">{booking.service}</p>
                        <p className="text-xs text-slate-500">Doorstep pick-up &amp; drop included</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-indigo-950">Drop Date</p>
                      <p>{booking.dropDate}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="font-semibold text-indigo-950">Expected Delivery</p>
                      <p>{booking.pickupDate}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {booking.statusSteps.map((step) => (
                      <span
                        key={step}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${
                          step === booking.status
                            ? 'border-brand-500 bg-brand-50 text-brand-700'
                            : 'border-slate-200 bg-white text-slate-400'
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m5 12 4 4L19 7" />
                        </svg>
                        {step}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                    <button type="button" className="btn-primary bg-brand-500 text-white hover:bg-brand-600">
                      View job card
                    </button>
                    <button type="button" className="btn-secondary border-brand-500 text-brand-600 hover:bg-brand-50">
                      Reschedule
                    </button>
                    <button type="button" className="text-sm font-semibold text-red-500 hover:text-red-600">
                      Cancel booking
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-lg font-semibold text-indigo-950">Need Help?</h3>
                <p className="mt-3 text-sm text-slate-600">
                  Call our booking helpline <strong>8904555007</strong> or chat with us for quick updates and approvals.
                </p>
                <button type="button" className="btn-primary mt-6 w-full bg-brand-500 text-white hover:bg-brand-600">
                  Chat with support
                </button>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
                <h3 className="text-lg font-semibold text-indigo-950">Upcoming schedule</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  <li>
                    <strong className="text-indigo-950">Doorstep pick-up:</strong> 16 Jun, 10:30 PM (Driver assigned)
                  </li>
                  <li>
                    <strong className="text-indigo-950">Workshop:</strong> Salt Lake Sector V, Bay 4
                  </li>
                  <li>
                    <strong className="text-indigo-950">Advisor:</strong> Rohan Das · +91 80111 22233
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookingsPage;
