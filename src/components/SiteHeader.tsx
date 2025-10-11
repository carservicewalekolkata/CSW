import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Link, NavLink } from 'react-router-dom';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { PiMapPinLineBold } from 'react-icons/pi';
import { BsCart2, BsPerson } from 'react-icons/bs';
import clsx from 'clsx';
import { useAppStore } from '@/store/appStore';

const navLinks = [
  { label: 'Spares', to: '/' },
  { label: 'Service', to: '/services' }
];

const moreLinks = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' }
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentCity, openLocationModal, cartItems } = useAppStore();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="bg-indigo-950 text-xs text-white">
        <div className="container-cs flex flex-col gap-2 py-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <a href="tel:8904555007" className="flex items-center gap-2 text-white/80 hover:text-white">
              <span className="font-semibold">Call:</span> 8904555007
            </a>
            <a
              href="mailto:support@carservicewale.com"
              className="hidden items-center gap-2 text-white/80 hover:text-white sm:flex"
            >
              <span className="font-semibold">Email:</span> support@carservicewale.com
            </a>
          </div>
          <p className="text-white/60">
            24/7 doorstep assistance across Kolkata. Genuine spares and expert mechanics at your service.
          </p>
        </div>
      </div>

      <div className="container-cs flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-indigo-950">
            <img
              src="/images/logos/primary/logo-header.svg"
              alt="Car Service Wale"
              className="h-10 w-auto"
              loading="lazy"
            />
            <span className="hidden md:inline">Car Service Wale</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx('transition hover:text-indigo-950', isActive && 'text-indigo-950')
              }
              end
            >
              {item.label}
            </NavLink>
          ))}

          <Menu as="div" className="relative text-sm">
            <Menu.Button className="flex items-center gap-1 font-semibold text-slate-600 transition hover:text-indigo-950">
              More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m6 9 6 6 6-6" />
              </svg>
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-slate-100 bg-white shadow-lg focus:outline-none">
                <div className="p-2">
                  {moreLinks.map((item) => (
                    <Menu.Item key={item.to}>
                      {({ active }) => (
                        <NavLink
                          to={item.to}
                          className={clsx(
                            'block rounded-md px-3 py-2 text-sm font-medium text-slate-600',
                            active && 'bg-brand-50 text-brand-700'
                          )}
                          end
                        >
                          {item.label}
                        </NavLink>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={openLocationModal}
            className="hidden items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-indigo-950 transition hover:border-brand-400 hover:text-brand-700 md:flex"
          >
            <PiMapPinLineBold className="h-5 w-5" />
            {currentCity.name}
          </button>

          <Link to="/cart" className="relative inline-flex items-center justify-center text-indigo-950">
            <BsCart2 className="h-6 w-6" />
            {cartItems > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-xs font-semibold text-white">
                {cartItems}
              </span>
            )}
          </Link>

          <Link to="/login" className="btn-secondary hidden lg:inline-flex">
            <BsPerson className="mr-2 h-4 w-4" /> Login
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-indigo-950 transition hover:border-brand-400 lg:hidden"
            aria-label="Open navigation menu"
          >
            <HiOutlineMenu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <Transition show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-200 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-200 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 right-0 flex w-full max-w-sm flex-col gap-6 overflow-y-auto bg-white px-6 py-6 shadow-xl">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-indigo-950" onClick={() => setMobileOpen(false)}>
                  <img src="/images/logos/primary/logo-header.svg" alt="Car Service Wale" className="h-10 w-auto" />
                </Link>
                <button
                  type="button"
                  className="rounded-full border border-slate-200 p-2 text-indigo-950"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <HiOutlineX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    openLocationModal();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-indigo-950"
                >
                  <PiMapPinLineBold className="h-5 w-5" />
                  Serving {currentCity.name}
                </button>

                <div className="space-y-2 text-base font-medium text-slate-700">
                  {navLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        clsx('block rounded-lg px-4 py-2', isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100')
                      }
                      end
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <div className="pt-2">
                    <p className="px-4 text-xs uppercase tracking-wider text-slate-400">More</p>
                    {moreLinks.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          clsx('block rounded-lg px-4 py-2', isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-slate-100')
                        }
                        end
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full"
                >
                  <BsPerson className="mr-2 h-4 w-4" /> Login
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary w-full"
                >
                  <BsCart2 className="mr-2 h-4 w-4" /> View Cart
                </Link>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </header>
  );
};

export default SiteHeader;
