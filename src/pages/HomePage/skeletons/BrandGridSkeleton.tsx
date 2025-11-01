import Skeleton from '@/components/Skeleton';

const BrandGridSkeleton = () => (
  <section className="bg-white py-20">
    <div className="container-cs space-y-8">
      <div className="space-y-3">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex min-h-[100px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <Skeleton className="h-12 w-24 rounded" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default BrandGridSkeleton;

