import Skeleton from '@/components/Skeleton';

const ServiceSectionSkeleton = () => (
  <section className="relative overflow-hidden bg-gradient-to-b from-[#F6FAFF] via-[#F1F7FF] to-[#F7FBFF] pb-24">
    <div className="container-cs relative">
      <div className="flex flex-col items-stretch gap-12 lg:flex-row lg:items-center">
        <div className="relative hidden justify-center md:flex md:w-[320px] md:flex-none lg:w-[360px] xl:w-[420px]">
          <Skeleton className="h-96 w-full rounded-[48px]" />
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-72" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-6">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-9 w-36 rounded-full" />
          </div>
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
                  <Skeleton className="h-32 w-full rounded-lg" />
                  <div className="space-y-3 pt-4">
                    <Skeleton className="h-5 w-3/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default ServiceSectionSkeleton;

