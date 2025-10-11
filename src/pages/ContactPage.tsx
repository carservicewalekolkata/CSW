import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Car Service Wale | Contact</title>
        <meta
          name="description"
          content="Need help with bookings or custom service plans? Contact Car Service Wale for quick assistance."
        />
      </Helmet>
      <section className="relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/banner-bg.jpg)' }}>
        <div className="absolute inset-0 bg-indigo-950/75" />
        <div className="container-cs relative z-10 py-20 text-white">
          <div className="max-w-3xl space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-200/80">Support</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Get in touch with us</h1>
            <p className="text-lg text-white/80">
              Have a question about bookings, service packages, or partnerships? Our support specialists are available 24/7
              to guide you.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-cs">
          <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link to="/" className="hover:text-indigo-950">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="font-semibold text-indigo-950">Contact</li>
            </ol>
          </nav>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-cs grid gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-indigo-950">Reach out directly</h2>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-4">
                <span className="text-2xl">📍</span>
                <span>
                  14 Panchannagram, Block A, G.S. Colony, Tiljala, E.M. Bypass, Kolkata - 700039
                </span>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-2xl">✉️</span>
                <a href="mailto:support@carservicewale.com" className="text-indigo-950 hover:text-brand-600">
                  support@carservicewale.com
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-2xl">📞</span>
                <a href="tel:8904555007" className="text-indigo-950 hover:text-brand-600">
                  8904555007
                </a>
              </li>
              <li className="flex items-center gap-4">
                <span className="text-2xl">🕒</span>
                <span>Monday - Sunday · 24x7 assistance</span>
              </li>
            </ul>
            <div className="space-y-3 rounded-3xl bg-slate-50 p-6 text-sm text-slate-600">
              <h3 className="text-lg font-semibold text-indigo-950">Emergency breakdown support</h3>
              <p>
                Stranded on the road? Call our hotline and choose <strong>Option 1</strong> for rapid roadside assistance.
                We partner with verified towing experts across Kolkata.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 shadow-card">
            <iframe
              title="Car Service Wale Kolkata"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d8765.089794304431!2d88.38618477628043!3d22.531695293678254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1s14%20Panchannagram%2C%20Block%20A%2C%20G.S.%20Colony%2C%20Tiljala%2C%20E.M.%20Bypass%2C%20Kolkata%20-%20700039%20map!5e0!3m2!1sen!2sin!4v1687424904559!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[400px] w-full rounded-3xl"
            />
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-20">
        <div className="container-cs grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-indigo-950">Write to us</h2>
            <p className="mt-3 text-slate-600">
              Share your query or service requirement. Our customer success team typically responds within two business hours.
            </p>
          </div>
          <form className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="text-sm font-medium text-indigo-950">
                Full name
                <input
                  type="text"
                  name="name"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="John Doe"
                  required
                />
              </label>
              <label className="text-sm font-medium text-indigo-950">
                Email
                <input
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="name@email.com"
                  required
                />
              </label>
              <label className="text-sm font-medium text-indigo-950">
                Phone
                <input
                  type="tel"
                  name="phone"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="8904 555 007"
                />
              </label>
              <label className="text-sm font-medium text-indigo-950">
                Preferred service
                <input
                  type="text"
                  name="service"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
                  placeholder="Periodic service, detailing, insurance claim..."
                />
              </label>
            </div>
            <label className="text-sm font-medium text-indigo-950">
              Message
              <textarea
                name="message"
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none"
                placeholder="Tell us how we can help"
                required
              />
            </label>
            <div className="flex items-center justify-between text-sm text-slate-500">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                I agree to the privacy policy
              </label>
              <button type="submit" className="btn-primary bg-brand-500 text-white hover:bg-brand-600">
                Send message
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
