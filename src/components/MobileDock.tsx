import { Link, useLocation } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';
import { PiMapPinLineBold } from 'react-icons/pi';
import { BsCart2, BsPerson } from 'react-icons/bs';
import clsx from 'clsx';
import { useAppStore } from '@/store/appStore';

const MobileDock = () => {
  const location = useLocation();
  const { openLocationModal, cartItems } = useAppStore();

  const items = [
    { to: '/', icon: HiOutlineHome, label: 'Home' },
    { to: '/login', icon: BsPerson, label: 'Profile' },
    { to: '/cart', icon: BsCart2, label: 'Cart' }
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t border-slate-200 bg-white px-6 py-3 shadow-card md:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={clsx(
              'relative inline-flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium',
              isActive ? 'text-brand-600' : 'text-slate-500'
            )}
          >
            <Icon className="h-6 w-6" />
            {item.label}
            {item.to === '/cart' && cartItems > 0 && (
              <span className="absolute right-4 top-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-semibold text-white">
                {cartItems}
              </span>
            )}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={openLocationModal}
        className="inline-flex flex-col items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium text-slate-500"
      >
        <PiMapPinLineBold className="h-6 w-6" />
        Location
      </button>
    </div>
  );
};

export default MobileDock;
