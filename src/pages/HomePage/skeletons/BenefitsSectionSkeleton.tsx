import Skeleton from '@/components/Skeleton';

const BenefitsSectionSkeleton = () => (
  <section className="overflow-hidden bg-white py-20">
    <div className="container-cs">
      <div className="max-w-xl space-y-3 mb-8">
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative flex items-center gap-4 rounded-xl bg-white p-5 shadow-[0_18px_45px_rgba(0,169,233,0.12)]">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BenefitsSectionSkeleton;

