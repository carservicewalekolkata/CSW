export type NavItem = {
  label: string;
  to: string;
};

export const primaryNav: NavItem[] = [
  { label: 'Spares', to: '/' },
  { label: 'Service', to: '/services' }
];

export const secondaryNav: NavItem[] = [
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' }
];
