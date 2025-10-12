import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import type { NavItem } from './config';

type DesktopNavProps = {
  primaryLinks: NavItem[];
  secondaryLinks: NavItem[];
};

const DesktopNav = ({ primaryLinks, secondaryLinks }: DesktopNavProps) => {
  return (
    <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
      {primaryLinks.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'transition',
              isActive ? 'text-sky-500' : 'text-indigo-900 hover:text-sky-500'
            )
          }
          end
        >
          {item.label}
        </NavLink>
      ))}

      <Menu as="div" className="relative text-sm">
        <Menu.Button className="flex items-center gap-1 font-semibold text-indigo-900 transition hover:text-sky-500">
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
              {secondaryLinks.map((item) => (
                <Menu.Item key={item.to}>
                  {({ active }) => (
                      <NavLink
                        to={item.to}
                        className={clsx(
                          'block rounded-md px-3 py-2 text-sm font-medium text-indigo-900',
                          active && 'bg-sky-50 text-sky-600'
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
  );
};

export default DesktopNav;
