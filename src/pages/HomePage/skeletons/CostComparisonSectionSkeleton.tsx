import Skeleton from '@/components/Skeleton';

const CostComparisonSectionSkeleton = () => (
  <section className="relative isolate overflow-hidden bg-[#001F3F] py-16">
    <div className="container-cs relative z-10 space-y-10 text-white">
      <div className="max-w-xl space-y-3">
        <Skeleton className="h-7 w-64 bg-white/30" />
        <Skeleton className="h-4 w-96 bg-white/20" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/10 p-6">
            <Skeleton className="h-6 w-40 bg-white/30" />
            <div className="mt-4 space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-4 w-full bg-white/20" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CostComparisonSectionSkeleton;

