export interface ServicePackage {
  name: string;
  mrp: number;
  price: number;
  duration: string;
  description?: string;
  inclusions: string[];
  image: string;
}

export const servicePackages: ServicePackage[] = [
  {
    name: 'Basic Service',
    mrp: 2400,
    price: 2091,
    duration: '6 hrs',
    description: 'Perfect for periodic maintenance with genuine consumables and a 50-point inspection.',
    image: '/images/service-image.jpg',
    inclusions: [
      'Exterior foam wash',
      'Engine oil replacement',
      'Air filter cleaning',
      'Coolant top-up (200 ml)',
      'Battery water top-up',
      'Cabin vacuum cleaning',
      'Oil filter replacement',
      'Windshield washer fluid top-up',
      'Heater & spark plug check'
    ]
  },
  {
    name: 'Standard Service',
    mrp: 3899,
    price: 3299,
    duration: '8 hrs',
    description: 'Adds comprehensive diagnostics and brake, suspension, and electrical system tune-up.',
    image: '/images/service-image.jpg',
    inclusions: [
      'All Basic Service inclusions',
      'Comprehensive brake inspection',
      'Throttle body cleaning',
      'Fuel filter check & clean',
      'Wheel rotation & balancing',
      'Complete interior detailing',
      'OBD-II diagnostics report'
    ]
  },
  {
    name: 'Premium Service',
    mrp: 5599,
    price: 4799,
    duration: '10 hrs',
    description: 'Ideal for annual maintenance including deep cleaning and preventive replacements.',
    image: '/images/service-image.jpg',
    inclusions: [
      'All Standard Service inclusions',
      'AC disinfectant treatment',
      'Injector cleaning',
      'Engine bay dressing',
      'All fluid top-ups and checks',
      'Interior anti-bacterial treatment',
      'Wheel alignment & balancing'
    ]
  }
];

export const serviceFaq = [
  {
    question: 'How long does a complete car service take?',
    answer: 'A periodic service typically takes 6 to 8 hours. Premium jobs may take up to 24 hours to accommodate paint drying, detailing, or specialised repairs.'
  },
  {
    question: 'Do you use genuine spare parts?',
    answer: 'Yes. We source OEM/OES spare parts directly from authorised suppliers. Every replacement is documented in your digital job card.'
  },
  {
    question: 'Is pick-up and drop really free?',
    answer: 'Absolutely. Our logistics team provides complimentary pick-up and drop within Kolkata city limits for every booking confirmed through the app or website.'
  },
  {
    question: 'Can I track my service status?',
    answer: 'Yes. Live updates, approvals, and media are shared through the Customer App and email so you can monitor progress in real-time.'
  }
];
