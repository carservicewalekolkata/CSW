import type { City } from '@/store/appStore';

type CityVisual = {
  image: string;
  accent: string;
};

const defaultVisual: CityVisual = {
  image: 'https://images.unsplash.com/photo-1526403224-3a56db76f125?auto=format&fit=crop&w=200&h=200&q=80',
  accent: 'from-indigo-500/60 via-purple-500/60 to-slate-900/60'
};

const cityVisualMap: Record<City['slug'], CityVisual> = {
  kolkata: {
    image: 'https://images.unsplash.com/photo-1582719478250-09f87b985d3d?auto=format&fit=crop&w=200&h=200&q=80',
    accent: 'from-sky-500/40 via-indigo-500/50 to-slate-900/50'
  },
  mumbai: {
    image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=200&h=200&q=80',
    accent: 'from-purple-500/45 via-indigo-500/45 to-slate-900/65'
  },
  delhi: {
    image: 'https://images.unsplash.com/photo-1542729178-2ecf8d80b5b9?auto=format&fit=crop&w=200&h=200&q=80',
    accent: 'from-rose-500/45 via-purple-500/45 to-slate-900/65'
  },
  hyderabad: {
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&h=200&q=80',
    accent: 'from-amber-500/45 via-purple-500/45 to-slate-900/65'
  }
};

export const getCityVisual = (slug: City['slug']) => {
  return cityVisualMap[slug] ?? defaultVisual;
};
