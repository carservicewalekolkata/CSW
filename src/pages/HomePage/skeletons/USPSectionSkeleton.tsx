import Skeleton from '@/components/Skeleton';

const USPSectionSkeleton = () => (
  <section className="relative sm:-mt-20 bg-transparent pb-20">
    <div className="container-cs">
      <div className="rounded-[28px] p-6 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[18px] bg-white p-6 shadow-[0_15px_40px_rgba(27,124,216,0.12)]">
              <div className="flex items-start gap-4">
                <Skeleton className="h-14 w-14 rounded-2xl" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-5 w-3/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default USPSectionSkeleton;

