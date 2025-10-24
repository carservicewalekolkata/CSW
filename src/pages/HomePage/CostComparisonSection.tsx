import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import type { HomeContent } from '@/hooks/useHomeContent';

interface CostComparisonSectionProps {
  data: HomeContent['costComparisons'];
}

const variantStyles: Record<
  HomeContent['costComparisons'][number]['variant'],
  {
    card: string;
    title: string;
    rowBg: string;
    label: string;
    price: string;
  }
> = {
  baseline: {
    card: 'bg-white/95 text-indigo-950 shadow-[0_25px_70px_rgba(18,36,68,0.12)]',
    title: 'text-indigo-950',
    rowBg: 'bg-indigo-50/70',
    label: 'text-slate-800',
    price: 'text-slate-500 line-through'
  },
  muted: {
    card: 'bg-[#E6F4FF]/90 text-indigo-950 shadow-[0_25px_70px_rgba(18,36,68,0.1)]',
    title: 'text-indigo-950',
    rowBg: 'bg-white/60',
    label: 'text-indigo-900',
    price: 'text-brand-700'
  },
  highlight: {
    card: 'bg-gradient-to-br from-[#19093C] via-[#220B72] to-[#1C5AE3] text-white shadow-[0_35px_80px_rgba(24,46,119,0.35)]',
    title: 'text-white',
    rowBg: 'bg-white/15 backdrop-blur-sm',
    label: 'text-white',
    price: 'text-brand-100'
  }
};

const CostComparisonSection = ({ data }: CostComparisonSectionProps) => {
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.1
      }
    );
  }, [data]);

  return (
    <section className="relative overflow-hidden py-20" style={{ backgroundImage: 'url(/images/backgrounds/comparability-bg.jpg)' }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#21103F]/95 via-[#1B0F35]/92 to-[#0A2443]/90" />
      <div className="container-cs relative z-10 space-y-10 text-white">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-3xl font-bold text-white">
            Cost <span className="text-brand-200">Comparability</span>
          </h2>
          <p className="text-base text-white/80 md:text-lg">
            Understand the price advantage of Car Service Wale compared with authorised and local service centres for popular models.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {data.map((column, index) => (
            <div
              key={column.title}
              ref={(el) => {
                if (el) cardsRef.current[index] = el;
              }}
              className={`rounded-[32px] border border-white/10 p-6 opacity-0 transition hover:-translate-y-1 ${variantStyles[column.variant].card}`}
            >
              <h3 className={`text-lg font-semibold leading-snug ${variantStyles[column.variant].title}`}>
                {column.title}
              </h3>
              <ul className="mt-6 space-y-3 text-sm">
                {column.rows.map((row) => (
                  <li
                    key={row.model}
                    className={`flex items-center justify-between rounded-2xl px-3 py-2 ${variantStyles[column.variant].rowBg}`}
                  >
                    <span className={`font-medium ${variantStyles[column.variant].label}`}>{row.model}</span>
                    <span className={`font-semibold ${variantStyles[column.variant].price}`}>
                      ₹{row.price.toLocaleString('en-IN')}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CostComparisonSection;
