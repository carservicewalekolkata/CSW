import type { HomeContent } from '@/hooks/useHomeContent';

interface ProcessSectionProps {
  items: HomeContent['process'];
}

const ProcessSection = ({ items }: ProcessSectionProps) => {
  return (
    <section className="bg-[#E9F4FF] py-20">
      <div className="container-cs space-y-12">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#2D1557]">
            How do <span className="text-brand-600">we</span> do it?
          </h2>
          <p className="mt-4 text-base text-[#4C4F6F]">
            Car servicing in Kolkata is now easier and more convenient than ever before.
          </p>
        </div>
        <div className="grid gap-10 max-md:text-center md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <div key={item.description} className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-[44px] bg-[url('/images/backgrounds/decor/icon-bg2.svg')] bg-cover bg-center">
                <img src={item.icon} alt={`Process step ${index + 1}`} className="h-16 w-16" loading="lazy" />
              </div>
              <p className="text-base font-medium text-[#3C3F5E]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
