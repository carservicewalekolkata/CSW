import { Link } from 'react-router-dom';
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaRegCalendarAlt } from 'react-icons/fa';
import { GoLocation } from "react-icons/go";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineMail, MdOutlineWatchLater } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

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
    <footer className="mt-20 border-t border-slate-200 bg-neutral-800">
      <div className="container-cs grid gap-12 py-16 lg:grid-cols-3">
        <div className="space-y-4">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/images/logos/primary/footer-logo.svg" alt="Car Service Wale" className="h-16 w-auto" />
          </Link>
          <p className="max-w-md text-sm text-slate-300">
            Car Service Wale is your one-stop partner for preventive maintenance, emergency repairs, insurance jobs,
            and genuine spare parts. We blend technology with expert craftsmanship to keep your vehicle road-ready.
          </p>
          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <GoLocation size={25} className='text-slate-300' />
              <span className="text-slate-300">14 Panchannagram, Block A, G.S. Colony, Tiljala, E.M. Bypass, Kolkata - 700039</span>
            </p>
          </div>
        </div>

        <div className="grid gap-12 sm:grid-cols-2 lg:col-span-2">
          <div>
            <h4 className="text-lg font-semibold text-slate-200">Quick Links</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {quickLinks.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  <span className="text-brand-600">
                    <IoIosArrowForward />
                  </span>
                  {item.to.startsWith('http') ? (
                    <a href={item.to} className="hover:text-slate-200 text-slate-300">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.to} className="hover:text-slate-200 text-slate-300">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-200">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <FaPhone size={15} className='text-slate-300' />
                <a href="tel:8904555007" className="text-slate-300">
                  8904555007
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MdOutlineMail size={20} className='text-slate-300' />
                <a href="mailto:support@carservicewale.com" className="text-slate-300">
                  support@carservicewale.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <span className="text-slate-300"><FaRegCalendarAlt size={18} /></span> Monday - Sunday &bull; 24x7 assistance
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <MdOutlineWatchLater size={20} />
                <span>24 hours</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-700">
        <div className="container-cs flex flex-col gap-6 py-3 text-base text-slate-300 md:flex-row md:items-center md:justify-between">
          <p className='text-slate-300'>© {new Date().getFullYear()} Car Service Wale. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">Find us on:</span>
            <ul className="flex items-center gap-3">
              {socialLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    className="flex h-8 w-8 p-1 items-center justify-center rounded-full border border-slate-200 text-slate-300 transition hover:border-brand-400 hover:text-brand-700"
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
