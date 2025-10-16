import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";

import type { HomeContent } from '@/hooks/useHomeContent';
import { useHeroCarouselStore } from "@/store/heroCarouselStore";

const HeroCarousel = ({ data }: { data: HomeContent['hero']; }) => {
    const slidesRef = useRef<HTMLDivElement[]>([]);
    const textRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const { activeIndex, nextSlide } = useHeroCarouselStore();

    const heroSlides = useMemo(
        () =>
            Array.from({ length: 3 }, (_, i) => ({
                image: '/images/hero/banner-image.svg',
                alt: `Car repair service illustration ${i + 1}`,
            })),
        []
    );

    useEffect(() => {
        const slides = slidesRef.current;
        const texts = textRef.current
            ? Array.from(textRef.current.querySelectorAll<HTMLElement>('[data-hero-text]'))
            : [];

        slides.forEach((el, i) => gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, x: 0 }));
        gsap.set(texts, { y: 40, autoAlpha: 0 });
        gsap.to(texts, { y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' });

        const playSlide = (index: number) => {
            slides.forEach((el, i) => {
                if (!el) return;
                if (i === index) {
                    gsap.set(el, { autoAlpha: 1, x: -90 });
                    gsap.to(el, { x: 0, duration: 1.05, ease: 'elastic.out(1, 0.6)' });
                } else {
                    gsap.set(el, { autoAlpha: 0, x: -90 });
                }
            });

            gsap.set(texts, { y: 40, autoAlpha: 0 });
            gsap.to(texts, {
                y: 0,
                autoAlpha: 1,
                stagger: 0.12,
                duration: 0.7,
                delay: 0.3,
                ease: 'power2.out',
            });
        };

        intervalRef.current = setInterval(() => {
            const next = nextSlide(heroSlides.length)
            playSlide(next)
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [heroSlides.length, nextSlide]);

    return (
        <div className="relative lg:pl-20">
            <div className="relative mx-auto flex h-[340px] w-full max-w-[500px] items-center justify-start">
                {heroSlides.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => el && (slidesRef.current[i] = el)}
                        className="absolute inset-0 flex items-center justify-center will-change-transform"
                    >
                        <img
                            src={item.image}
                            alt={item.alt}
                            className="relative z-10 h-auto w-full"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            <div ref={textRef} className="mt-8 flex flex-col gap-2 text-[#30155B]">
                <span data-hero-text className="text-lg font-semibold uppercase tracking-[0.45em] text-[#1e51a3]">
                    24/7
                </span>
                <h1 data-hero-text className="text-xl font-semibold leading-snug text-[#2d1557] sm:text-xl">
                    On spot Car 
                    <span className="font-extrabold text-[#2d1557]"> Repair Service</span>
                </h1>
                <p data-hero-text className="max-w-md text-sm text-[#6c74a0]">{data.description}</p>
            </div>
        </div>
    )
}

export default HeroCarousel