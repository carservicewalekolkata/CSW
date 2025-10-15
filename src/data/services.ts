export interface ServiceFaqItem {
  question: string;
  answer: string;
}

export const serviceFaq: ServiceFaqItem[] = [
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
