import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineChevronDown, HiOutlineMenu } from 'react-icons/hi';
import { PiMapPinLineBold } from 'react-icons/pi';
import { BsCart2, BsPerson } from 'react-icons/bs';
import { useAppStore } from '@/store/appStore';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import ProgressIndicator from './ProgressIndicator';
import { primaryNav, secondaryNav } from './config';
import { useScrollProgress } from './useScrollProgress';

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentCity, openLocationModal, cartItems } = useAppStore();
  const scrollProgress = useScrollProgress();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur">
      <div className="relative border-b border-cyan-200/40 shadow-[0_1px_0_rgba(12,74,110,0.05)]">
        <ProgressIndicator progress={scrollProgress} />
        <div className="container-cs flex items-center justify-between py-4 lg:py-5">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-5 text-lg font-semibold text-indigo-950">
              <picture>
                <source media="(min-width: 560px)" srcSet="/images/logos/primary/3x/Car-Service-wale-Logo.png" />
                <img
                  src="/images/logos/primary/1x/CarServiceWale-Logo.png"
                  alt="Car Service Wale"
                  className="h-14 w-auto md:h-14 xl:h-16"
                  loading="lazy"
                />
              </picture>
            </Link>
            <button
              type="button"
              onClick={openLocationModal}
              className="hidden items-center gap-2 rounded-full border border-brand-900/25 px-3 py-2 text-sm font-semibold text-indigo-950 transition hover:text-sky-600 md:flex"
            >
              <PiMapPinLineBold className="h-5 w-5 text-sky-500" />
              <span>{currentCity.name}</span>
              <HiOutlineChevronDown className="h-4 w-4 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center gap-5">
            <DesktopNav primaryLinks={primaryNav} secondaryLinks={secondaryNav} />

            <Link to="/cart" className="relative inline-flex items-center justify-center text-indigo-900 transition hover:text-sky-600">
              <BsCart2 className="h-6 w-6" />
              {cartItems > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                  {cartItems}
                </span>
              )}
            </Link>

            <Link
              to="/login"
              className="hidden items-center justify-center gap-2 rounded-lg bg-sky-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 lg:inline-flex"
            >
              <BsPerson className="mr-2 h-4 w-4" /> Login
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-indigo-900 transition hover:border-sky-400 hover:text-sky-600 lg:hidden"
              aria-label="Open navigation menu"
            >
              <HiOutlineMenu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        primaryLinks={primaryNav}
        secondaryLinks={secondaryNav}
        currentCityName={currentCity.name}
        onLocationRequest={() => openLocationModal()}
        cartItems={cartItems}
      />
    </header>
  );
};

export default SiteHeader;
