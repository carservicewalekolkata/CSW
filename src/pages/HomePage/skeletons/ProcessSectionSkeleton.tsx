import Skeleton from '@/components/Skeleton';

const ProcessSectionSkeleton = () => (
  <section className="bg-white py-16">
    <div className="container-cs space-y-8">
      <Skeleton className="h-6 w-48" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="mt-4 h-4 w-40" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSectionSkeleton;

