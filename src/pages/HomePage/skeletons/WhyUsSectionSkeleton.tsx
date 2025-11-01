import Skeleton from '@/components/Skeleton';

const WhyUsSectionSkeleton = () => (
  <section className="relative overflow-hidden bg-white py-24">
    <div className="container-cs grid gap-12 lg:grid-cols-[minmax(0,640px)_minmax(0,520px)] lg:items-start lg:gap-20">
      <div className="order-2 flex justify-center lg:order-1 mt-5 lg:justify-start">
        <Skeleton className="h-72 w-full max-w-[840px] rounded-xl" />
      </div>
      <div className="order-1 flex flex-col gap-6 lg:order-2">
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex flex-col gap-6 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid h-[90px] w-4/5 grid-cols-[auto_1fr] items-center gap-8 rounded-lg border border-white/20 bg-white px-5 shadow-[0_40px_80px_rgba(8,29,73,0.08)]">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhyUsSectionSkeleton;

