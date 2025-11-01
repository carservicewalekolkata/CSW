import Skeleton from '@/components/Skeleton';

const TestimonialSectionSkeleton = () => (
  <section className="bg-white py-20">
    <div className="container-cs space-y-8">
      <Skeleton className="h-6 w-56" />
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialSectionSkeleton;

