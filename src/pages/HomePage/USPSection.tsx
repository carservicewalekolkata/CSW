import type { HomeContent } from '@/hooks/useHomeContent';

interface USPSectionProps {
  items: HomeContent['usp'];
}

const USPSection = ({ items }: USPSectionProps) => {
  return (
    <section className="relative -mt-20 bg-transparent pb-20">
      <div className="container-cs">
        <div className="rounded-[28px] bg-white/95 p-6 shadow-[0_30px_90px_rgba(25,118,210,0.18)] backdrop-blur-sm ring-1 ring-sky-50 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-[18px] bg-white p-6 shadow-[0_15px_40px_rgba(27,124,216,0.12)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(27,124,216,0.18)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFEEF1] via-white to-[#FFE0E7] shadow-inner">
                  <img src={item.icon} alt="" className="h-8 w-8" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#2d1557]">{item.title}</h3>
                  <p className="mt-3 text-sm text-[#6c74a0]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default USPSection;
