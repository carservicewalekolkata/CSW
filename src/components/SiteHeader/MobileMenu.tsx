import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { NavLink } from 'react-router-dom';
import { PiMapPinLineBold } from 'react-icons/pi';
import { BsCart2, BsPerson } from 'react-icons/bs';
import { HiOutlineX } from 'react-icons/hi';
import clsx from 'clsx';
import type { NavItem } from './config';

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  primaryLinks: NavItem[];
  secondaryLinks: NavItem[];
  currentCityName: string;
  onLocationRequest: () => void;
  cartItems: number;
};

const MobileMenu = ({
  open,
  onClose,
  primaryLinks,
  secondaryLinks,
  currentCityName,
  onLocationRequest,
  cartItems
}: MobileMenuProps) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
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
              <NavLink to="/" className="flex items-center gap-3 text-lg font-semibold text-indigo-950" onClick={onClose} end>
                <img src="/images/logos/primary/logo-header.svg" alt="Car Service Wale" className="h-10 w-auto" />
              </NavLink>
              <button
                type="button"
                className="rounded-full border border-slate-200 p-2 text-indigo-950"
                onClick={onClose}
                aria-label="Close navigation menu"
              >
                <HiOutlineX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => {
                  onLocationRequest();
                  onClose();
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-indigo-950 transition hover:border-sky-300 hover:text-sky-600"
              >
                <PiMapPinLineBold className="h-5 w-5 text-sky-500" />
                Serving {currentCityName}
              </button>

              <div className="space-y-2 text-base font-medium text-slate-700">
                {primaryLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      clsx(
                        'block rounded-lg px-4 py-2 text-indigo-900 transition',
                        isActive ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-100 hover:text-sky-600'
                      )
                    }
                    end
                  >
                    {item.label}
                  </NavLink>
                ))}
                <div className="pt-2">
                  <p className="px-4 text-xs uppercase tracking-wider text-slate-400">More</p>
                  {secondaryLinks.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        clsx(
                          'block rounded-lg px-4 py-2 text-indigo-900 transition',
                          isActive ? 'bg-sky-50 text-sky-600' : 'hover:bg-slate-100 hover:text-sky-600'
                        )
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
              <NavLink to="/login" onClick={onClose} className="btn-primary w-full" end>
                <BsPerson className="mr-2 h-4 w-4" /> Login
              </NavLink>
              <NavLink to="/cart" onClick={onClose} className="btn-secondary w-full" end>
                <BsCart2 className="mr-2 h-4 w-4" /> View Cart{cartItems > 0 ? ` (${cartItems})` : ''}
              </NavLink>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default MobileMenu;
