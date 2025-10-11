import { create } from 'zustand';

type CityStatus = 'active' | 'upcoming';

export type City = {
  name: string;
  slug: string;
  status: CityStatus;
};

interface AppState {
  currentCity: City;
  cities: City[];
  isLocationModalOpen: boolean;
  cartItems: number;
  setCity: (citySlug: string) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  incrementCart: (count?: number) => void;
  setCartItems: (count: number) => void;
  resetCart: () => void;
}

const cityList: City[] = [
  { name: 'Kolkata', slug: 'kolkata', status: 'active' },
  { name: 'Mumbai', slug: 'mumbai', status: 'upcoming' },
  { name: 'Delhi', slug: 'delhi', status: 'upcoming' },
  { name: 'Hyderabad', slug: 'hyderabad', status: 'upcoming' }
];

export const useAppStore = create<AppState>((set) => ({
  currentCity: cityList[0],
  cities: cityList,
  isLocationModalOpen: false,
  cartItems: 0,
  setCity: (citySlug: string) =>
    set((state) => {
      const city = state.cities.find((item) => item.slug === citySlug);
      if (!city || city.status === 'upcoming') {
        return state;
      }
      return {
        ...state,
        currentCity: city,
        isLocationModalOpen: false
      };
    }),
  openLocationModal: () => set({ isLocationModalOpen: true }),
  closeLocationModal: () => set({ isLocationModalOpen: false }),
  incrementCart: (count = 1) =>
    set((state) => ({
      cartItems: Math.max(0, state.cartItems + count)
    })),
  setCartItems: (count: number) =>
    set(() => ({
      cartItems: Math.max(0, count)
    })),
  resetCart: () => set({ cartItems: 0 })
}));
