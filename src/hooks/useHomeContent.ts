import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/apiClient';

export interface HomeContent {
  hero: {
    headline: string;
    subheadline: string;
    description: string;
    ctaText: string;
    brands: { name: string; logo: string }[];
  };
  usp: { icon: string; title: string; description: string }[];
  services: {
    primary: { name: string; icon: string; href: string }[];
    custom: { name: string; icon: string; href: string }[];
  };
  costComparisons: {
    title: string;
    variant: 'baseline' | 'muted' | 'highlight';
    rows: { model: string; price: number }[];
  }[];
  whyUs: { icon: string; title: string; description: string }[];
  testimonials: { name: string; role: string; headline: string; message: string }[];
  benefits: { step: number; title: string; description: string }[];
  process: { icon: string; description: string }[];
  brandLogos: string[];
  appPromo: { title: string; description: string; image: string };
}

export const useHomeContent = () => {
  return useQuery<HomeContent>({
    queryKey: ['home-content'],
    queryFn: () => apiRequest<HomeContent>({ endpoint: '/data/home.json' })
  });
};
