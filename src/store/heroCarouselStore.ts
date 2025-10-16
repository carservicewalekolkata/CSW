import { create } from 'zustand';

interface HeroCarouselState {
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  nextSlide: (total: number) => number;
}

export const useHeroCarouselStore = create<HeroCarouselState>((set, get) => ({
  activeIndex: 0,
  setActiveIndex: (index) => set({ activeIndex: index }),
  nextSlide: (total) => {
    const next = (get().activeIndex + 1) % total;
    set({ activeIndex: next });
    return next;
  },
}));
