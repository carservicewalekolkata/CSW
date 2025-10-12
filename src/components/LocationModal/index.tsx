import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { HiOutlineX } from 'react-icons/hi';
import { useAppStore } from '@/store/appStore';
import CityOption from './CityOption';

const LocationModal = () => {
  const { cities, currentCity, isLocationModalOpen, closeLocationModal, setCity } = useAppStore();

  return (
    <Transition show={isLocationModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeLocationModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 sm:scale-95 sm:translate-y-0"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-2 sm:scale-95 sm:translate-y-0"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl transition-all">
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 sm:px-8">
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-indigo-950">Select City</Dialog.Title>
                    <p className="mt-1 text-sm text-slate-500">
                      Choose your service location. We will notify you as we expand to new cities.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={closeLocationModal}
                    className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-indigo-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2"
                    aria-label="Close city selector"
                  >
                    <HiOutlineX className="h-5 w-5" />
                  </button>
                </div>

                <div className="px-6 pb-6 pt-4 sm:px-8 sm:pt-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {cities.map((city) => (
                      <CityOption
                        key={city.slug}
                        city={city}
                        isCurrent={currentCity.slug === city.slug}
                        onSelect={setCity}
                      />
                    ))}
                  </div>
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
