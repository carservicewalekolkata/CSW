import Skeleton from '@/components/Skeleton';

const HeroSectionSkeleton = () => (
  <section className="relative isolate overflow-hidden">
    <div className="absolute inset-0">
      <div className="h-full w-full bg-[url('/images/backgrounds/banner-bg.jpg')] bg-cover bg-center bg-no-repeat opacity-40" />
    </div>
    <div className="container-cs relative z-10 pt-20 sm:pt-24 lg:pt-36 pb-14 sm:pb-16 lg:pb-20">
      <div className="grid items-start gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/5 rounded" />
          <Skeleton className="h-6 w-4/6" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="h-10 w-40 mt-4" />
          <div className="grid grid-cols-3 gap-3 pt-6">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        </div>
        <div className="w-full">
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    </div>
  </section>
);

export default HeroSectionSkeleton;

