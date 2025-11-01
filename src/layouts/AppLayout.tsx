import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import LocationModal from '@/components/LocationModal';
import ChatWidget from '@/components/ChatWidget';
import MobileDock from '@/components/MobileDock';
import Skeleton from '@/components/Skeleton';
import HomePageSkeleton from '@/pages/HomePage/skeletons/HomePageSkeleton';

const Loader = () => {
  const { pathname } = useLocation();
  if (pathname === '/') {
    return <HomePageSkeleton />;
  }
  return (
    <div className="container-cs py-16 space-y-6">
      <Skeleton className="h-7 w-64" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            <Skeleton className="h-24 w-full rounded-lg" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

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
