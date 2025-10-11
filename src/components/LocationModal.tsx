import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useAppStore } from '@/store/appStore';

const LocationModal = () => {
  const { cities, currentCity, isLocationModalOpen, closeLocationModal, setCity } = useAppStore();

  return (
    <Transition show={isLocationModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeLocationModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-indigo-950">Select your city</Dialog.Title>
                <p className="mt-1 text-sm text-slate-600">
                  We are rapidly expanding across India. Choose an active zone to explore available services.
                </p>
                <div className="mt-6 space-y-3">
                  {cities.map((city) => {
                    const isActive = city.status === 'active';
                    const isCurrent = currentCity.slug === city.slug;
                    return (
                      <button
                        key={city.slug}
                        type="button"
                        onClick={() => isActive && setCity(city.slug)}
                        disabled={!isActive}
                        className={clsx(
                          'flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition',
                          isCurrent && 'border-brand-400 bg-brand-50/70',
                          !isCurrent && isActive && 'border-slate-200 hover:border-brand-300 hover:bg-brand-50/60',
                          !isActive && 'cursor-not-allowed border-dashed border-slate-200 bg-slate-50 text-slate-400'
                        )}
                      >
                        <span className="text-sm font-semibold text-indigo-950">{city.name}</span>
                        <span className="text-xs font-medium uppercase tracking-wide">
                          {isCurrent ? (
                            <span className="text-brand-600">Selected</span>
                          ) : isActive ? (
                            <span className="text-slate-400">Available</span>
                          ) : (
                            <span className="text-slate-300">Coming soon</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={closeLocationModal}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LocationModal;
