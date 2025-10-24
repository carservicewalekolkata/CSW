import { useQuery } from '@tanstack/react-query';

import type { ServiceCategory } from '@/types/api';
import type { ServiceCatalog } from './useServiceCatalog';
import { fetchServiceCatalog, serviceCatalogQueryKey } from './useServiceCatalog';

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
    primary: { id: number; name: string; description: string; href: string }[];
    custom: { id: number; name: string; description: string; href: string }[];
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

const HERO_COPY = {
  headline: '24/7 On-Spot Car & Bike Mechanic Repair Service',
  subheadline: 'Experience the best car service in Kolkata',
  description:
    'Look no further! Get a free personalized quote for your car and enjoy genuine spares, transparent pricing, and doorstep pick-up.',
  ctaText: 'Get a Quote'
} as const;

const FALLBACK_HERO_BRANDS: HomeContent['hero']['brands'] = [];

const FALLBACK_SERVICE_GROUPS: HomeContent['services'] = {
  primary: [
    {
      id: 1,
      name: 'Periodic Service',
      description: 'Scheduled maintenance packages to keep your vehicle in peak condition.',
      href: '/services'
    },
    {
      id: 2,
      name: 'Engine Repair',
      description: 'Comprehensive engine diagnostics, rebuilds, and component replacements.',
      href: '/services'
    },
    {
      id: 3,
      name: 'Electrical & Diagnostics',
      description: 'Advanced electrical troubleshooting and ECU health checks.',
      href: '/services'
    }
  ],
  custom: [
    {
      id: 4,
      name: 'Custom Restoration',
      description: 'Tailor-made projects for restoration, upgrades, and speciality builds.',
      href: '/services'
    },
    {
      id: 5,
      name: 'Performance Tuning',
      description: 'Custom tuning packages for enthusiasts seeking more power and control.',
      href: '/services'
    }
  ]
};

const USP_ITEMS: HomeContent['usp'] = [
  {
    icon: '/images/icons/general/steering-wheel.svg',
    title: 'Free Pick & Drop',
    description: 'Relax while our logistics crew handles vehicle pick-up and drop-off.'
  },
  {
    icon: '/images/icons/general/plan.svg',
    title: 'Plan Your Service',
    description: 'Choose from curated packages or custom jobs at your convenience.'
  },
  {
    icon: '/images/icons/general/real-time.svg',
    title: 'Real-Time Updates',
    description: 'Stay informed with live job cards and technician notes.'
  },
  {
    icon: '/images/icons/general/pricing.svg',
    title: 'Honest Pricing',
    description: 'Upfront, itemised estimates with no hidden charges.'
  }
];

const COST_COMPARISONS: HomeContent['costComparisons'] = [
  {
    title: 'Authorized Service Center Price',
    variant: 'baseline',
    rows: [
      { model: 'i10', price: 3498 },
      { model: 'Tiago', price: 3498 },
      { model: 'WagonR', price: 3498 },
      { model: 'City', price: 3799 },
      { model: 'XUV500', price: 5399 }
    ]
  },
  {
    title: 'Local Service Center Price',
    variant: 'muted',
    rows: [
      { model: 'i10', price: 2699 },
      { model: 'Tiago', price: 2699 },
      { model: 'WagonR', price: 2699 },
      { model: 'City', price: 2899 },
      { model: 'XUV500', price: 3999 }
    ]
  },
  {
    title: 'Car Service Wale Price',
    variant: 'highlight',
    rows: [
      { model: 'i10', price: 2199 },
      { model: 'Tiago', price: 2199 },
      { model: 'WagonR', price: 2199 },
      { model: 'City', price: 2399 },
      { model: 'XUV500', price: 3499 }
    ]
  }
];

const WHY_US_ITEMS: HomeContent['whyUs'] = [
  {
    icon: '/images/illustrations/workflow/w-csw1.svg',
    title: '100% Genuine OEM/OES Spares',
    description: 'Certified suppliers and audited inventory ensure every replacement part is original.'
  },
  {
    icon: '/images/illustrations/workflow/w-csw2.svg',
    title: 'Highly-Skilled Mechanics',
    description: 'Factory-trained technicians specialising in multi-brand diagnostics.'
  },
  {
    icon: '/images/illustrations/workflow/w-csw3.svg',
    title: 'Live Service Tracking',
    description: 'Track every milestone with photos, videos, and approvals within the app.'
  }
];

const TESTIMONIALS: HomeContent['testimonials'] = [
  {
    name: 'Harsh Mahajan',
    role: 'Customer',
    headline: 'Extremely satisfied with the service!',
    message:
      'My experience with Car Service Wale was excellent. Got my car painted at a competitive price with timely updates throughout the process.'
  },
  {
    name: 'Priya Sharma',
    role: 'Customer',
    headline: 'Trustworthy and prompt',
    message:
      'Doorstep pick-up was on time, and the technicians explained every job in detail. I loved the transparent job card.'
  },
  {
    name: 'Rahul Verma',
    role: 'Customer',
    headline: 'Great value for money',
    message:
      'Genuine spares, fair pricing, and proactive communication. Highly recommend their periodic maintenance packages.'
  }
];

const BENEFITS: HomeContent['benefits'] = [
  {
    step: 1,
    title: 'Select the perfect service',
    description: 'Browse curated packages from the Car Service Wale portfolio.'
  },
  {
    step: 2,
    title: 'Schedule free doorstep pick-up',
    description: 'Choose the slot that works for you and we handle the rest.'
  },
  {
    step: 3,
    title: 'Track progress in real-time',
    description: 'Approve jobs and monitor progress from the mobile app.'
  },
  {
    step: 4,
    title: 'Refer and earn rewards',
    description: 'Invite friends to unlock complimentary services and wallet credits.'
  }
];

const PROCESS_STEPS: HomeContent['process'] = [
  {
    icon: '/images/illustrations/why-us/w-d-1.svg',
    description: 'Comprehensive diagnostics isolate the root cause of every issue.'
  },
  {
    icon: '/images/illustrations/why-us/w-d-2.svg',
    description: 'Skilled mechanics execute repairs with precision and genuine spares.'
  },
  {
    icon: '/images/illustrations/why-us/w-d-3.svg',
    description: 'Post-service quality checks ensure every parameter exceeds standards.'
  },
  {
    icon: '/images/illustrations/why-us/w-d-4.svg',
    description: 'Convenient digital payments via UPI, cards, net banking, and wallets.'
  }
];

const APP_PROMO: HomeContent['appPromo'] = {
  title: 'We are just one tap away',
  description:
    'This app is available for your smartphone. Track jobs, approve estimates, and chat with our support team.',
  image: '/images/icons/general/mobile.svg'
};

const toCategoryCard = (category: ServiceCategory): HomeContent['services']['primary'][number] => ({
  id: category.id,
  name: category.name,
  description: (() => {
    const fallback = 'Explore tailored packages designed by our expert mechanics.';
    const source = category.description && category.description.length > 0 ? category.description : fallback;
    return source.length > 160 ? `${source.slice(0, 157)}...` : source;
  })(),
  href: '/services'
});

const createServiceGroups = (categories: ServiceCatalog['categories']): HomeContent['services'] => {
  if (!categories.length) {
    return FALLBACK_SERVICE_GROUPS;
  }

  const primary = categories.filter((category) => category.type !== 'custom').map(toCategoryCard).slice(0, 8);
  const custom = categories.filter((category) => category.type === 'custom').map(toCategoryCard).slice(0, 8);

  return {
    primary: primary.length ? primary : FALLBACK_SERVICE_GROUPS.primary,
    custom: custom.length ? custom : FALLBACK_SERVICE_GROUPS.custom
  };
};

const toHomeContent = (catalog: ServiceCatalog): HomeContent => {
  const serviceGroups = createServiceGroups(catalog.categories);

  const brandLogos = catalog.brands
    .map((brand) => brand.iconUrl)
    .filter((logo): logo is string => Boolean(logo));

  const heroBrands = catalog.brands
    .filter((brand) => Boolean(brand.iconUrl))
    .slice(0, 5)
    .map((brand) => ({ name: brand.name, logo: brand.iconUrl! }));

  return {
    hero: {
      ...HERO_COPY,
      brands: heroBrands.length ? heroBrands : FALLBACK_HERO_BRANDS
    },
    usp: USP_ITEMS,
    services: serviceGroups,
    costComparisons: COST_COMPARISONS,
    whyUs: WHY_US_ITEMS,
    testimonials: TESTIMONIALS,
    benefits: BENEFITS,
    process: PROCESS_STEPS,
    brandLogos,
    appPromo: APP_PROMO
  };
};

export const useHomeContent = () =>
  useQuery<ServiceCatalog, Error, HomeContent>({
    queryKey: serviceCatalogQueryKey,
    queryFn: fetchServiceCatalog,
    select: toHomeContent
  });
