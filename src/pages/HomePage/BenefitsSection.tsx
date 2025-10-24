import type { HomeContent } from '@/hooks/useHomeContent';

interface BenefitsSectionProps {
  items: HomeContent['benefits'];
}

const BenefitsSection = ({ items }: BenefitsSectionProps) => {
  return (
    <section className="overflow-hidden bg-white py-20">
      <div className="relative mx-auto flex w-full flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:items-end lg:gap-16 lg:px-0">
        <div className="absolute aspect-square overflow-hidden h-[450px] w-[550px] rounded-tr-[150px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.08)]">
          <img
            src="/images/backgrounds/benefit-bg.jpg"
            alt="Technician servicing a vehicle with a wrench"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className='container-cs flex gap-5 justify-center lg:justify-start'>
          <div className="relative w-full lg:w-[42%]">
            <div className="pointer-events-none absolute -bottom-5 -left-5 w-[500px]">
              <img
                src="/images/hero/car.png"
                alt="Parked blue SUV after maintenance"
                className="w-full drop-shadow-[0_26px_55px_rgba(33,45,71,0.26)]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="relative flex w-full flex-col gap-9 lg:flex-1">
            <div className="space-y-4">
              <h2 className="text-[2.15rem] font-semibold leading-tight text-[#2C1A68] sm:text-[2.3rem]">
                Car Service Wale
                <span className="block text-[2.35rem] font-semibold text-[#3D1D8C] sm:text-[2.45rem]">Benefits</span>
              </h2>
              <p className="max-w-xl text-base text-slate-600">
                We simplify automotive care with a streamlined, transparent workflow tailored to keep your car
                road-ready without the guesswork.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <article
                  key={item.step}
                  className="flex items-center justify-end relative gap-2 px-6 rounded-lg py-3 bg-white shadow-[0_18px_45px_rgba(0,169,233,0.18)] transition hover:translate-y-[-3px] hover:shadow-[0_26px_65px_rgba(0,169,233,0.24)] overflow-hidden"
                >
                  <div className="absolute -left-5 -top-7 flex h-24 w-24 items-end justify-center overflow-hidden rounded-full bg-[#06AEEE] text-base font-semibold text-white">
                    <span className="z-10 mb-7">{item.step}</span>
                    <span className="rounded-full bg-[#E9F9FF]" />
                  </div>
                  <div className='flex flex-col w-3/4'>
                    <h3 className="text-sm font-semibold text-[#00315A]">{item.title}</h3>
                    <p className="text-xs m-0 leading-relaxed text-[#496272]">{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
