import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';

const popularAreas = [
  'Garage in Barrackpore',
  'Garage in Salt Lake',
  'Garage in Tollygunge',
  'Garage in Howrah',
  'Garage in New Town',
  'Garage in Dum Dum'
];

const quickLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' }
];

const socialLinks = [
  { label: 'Facebook', icon: <FaFacebookF />, href: 'https://www.facebook.com/carservicewale' },
  { label: 'LinkedIn', icon: <FaLinkedinIn />, href: 'https://www.linkedin.com/company/carservicewale' },
  { label: 'Twitter', icon: <FaTwitter />, href: 'https://twitter.com/carservicewale' },
  { label: 'YouTube', icon: <FaYoutube />, href: 'https://www.youtube.com/@carservicewale' }
];

const SiteFooter = () => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-cs grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/images/logos/primary/footer-logo.svg" alt="Car Service Wale" className="h-12 w-auto" />
          </Link>
          <p className="max-w-md text-sm text-slate-600">
            Car Service Wale is your one-stop partner for preventive maintenance, emergency repairs, insurance jobs,
            and genuine spare parts. We blend technology with expert craftsmanship to keep your vehicle road-ready.
          </p>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex items-start gap-2">
              <span className="mt-1 text-brand-600">📍</span>
              <span>14 Panchannagram, Block A, G.S. Colony, Tiljala, E.M. Bypass, Kolkata - 700039</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-600">📞</span>
              <a href="tel:8904555007" className="hover:text-indigo-950">
                8904555007
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-600">✉️</span>
              <a href="mailto:support@carservicewale.com" className="hover:text-indigo-950">
                support@carservicewale.com
              </a>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-brand-600">🗓️</span> Monday - Sunday &bull; 24x7 assistance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <img src="/images/logos/app-stores/playStore.svg" alt="Download on Google Play" className="h-12 w-auto" />
            <img src="/images/logos/app-stores/app-store.svg" alt="Download on App Store" className="h-12 w-auto" />
          </div>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:col-span-2">
          <div>
            <h4 className="text-lg font-semibold text-indigo-950">Popular Areas</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {popularAreas.map((area) => (
                <li key={area} className="flex items-start gap-2">
                  <span className="mt-1 text-brand-600">›</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-indigo-950">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {quickLinks.map((item) => (
                <li key={item.label} className="flex items-start gap-2">
                  <span className="mt-1 text-brand-600">›</span>
                  {item.to.startsWith('http') ? (
                    <a href={item.to} className="hover:text-indigo-950">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.to} className="hover:text-indigo-950">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200">
        <div className="container-cs flex flex-col gap-6 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Car Service Wale. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Find us on:</span>
            <ul className="flex items-center gap-3">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-brand-400 hover:text-brand-700"
                  >
                    {item.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
