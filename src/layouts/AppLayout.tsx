import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import LocationModal from '@/components/LocationModal';
import ChatWidget from '@/components/ChatWidget';
import MobileDock from '@/components/MobileDock';

const Loader = () => (
  <div className="flex w-full justify-center py-16">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
  </div>
);

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={<Loader />}>
          <Outlet />
        </Suspense>
      </main>
      <SiteFooter />
      <LocationModal />
      <ChatWidget />
      <MobileDock />
    </div>
  );
};

export default AppLayout;
