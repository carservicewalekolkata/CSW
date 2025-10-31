import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CityStatus = 'active' | 'upcoming';

export type City = {
  name: string;
  slug: string;
  status: CityStatus;
};

export type CartServiceItem = {
  id: string;
  serviceId: string;
  name: string;
  category: string;
  price: number;
  thumbnail: string | null;
  description?: string | null;
  timeTaken?: string | null;
};

type CartStage = 'idle' | 'confirmed';

export type CartOrder = {
  id: string;
  reference: string;
  phone: string;
  items: CartServiceItem[];
  total: number;
  createdAt: string;
  status: 'on-cart' | 'booked' | 'solved' | 'cancelled';
};

interface AppState {
  currentCity: City;
  cities: City[];
  isLocationModalOpen: boolean;
  cartItems: number;
  cartItemsDetailed: CartServiceItem[];
  customerPhone: string | null;
  orders: CartOrder[];
  cartStage: CartStage;
  setCity: (citySlug: string) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
  incrementCart: (count?: number) => void;
  setCartItems: (count: number) => void;
  resetCart: () => void;
  setCustomerPhone: (phone: string) => void;
  addServiceToCart: (item: CartServiceItem) => void;
  removeServiceFromCart: (serviceId: string) => void;
  completeBooking: (payload: { phone: string; items: CartServiceItem[]; total: number }) => void;
}

const cityList: City[] = [
  { name: 'Kolkata', slug: 'kolkata', status: 'active' },
  { name: 'Mumbai', slug: 'mumbai', status: 'upcoming' },
  { name: 'Delhi', slug: 'delhi', status: 'upcoming' },
  { name: 'Hyderabad', slug: 'hyderabad', status: 'upcoming' }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, _get) => ({
      currentCity: cityList[0],
      cities: cityList,
      isLocationModalOpen: false,
      cartItems: 0,
      cartItemsDetailed: [],
      customerPhone: null,
      orders: [],
      cartStage: 'idle',
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
      resetCart: () => set({ cartItems: 0, cartItemsDetailed: [], cartStage: 'idle' }),
      setCustomerPhone: (phone: string) => set({ customerPhone: phone }),
      addServiceToCart: (item: CartServiceItem) =>
        set((state) => {
          if (state.cartItemsDetailed.some((cartItem) => cartItem.serviceId === item.serviceId)) {
            return state;
          }
          const next = [...state.cartItemsDetailed, item];
          return {
            cartItemsDetailed: next,
            cartItems: next.length,
            cartStage: 'idle'
          };
        }),
      removeServiceFromCart: (serviceId: string) =>
        set((state) => {
          const next = state.cartItemsDetailed.filter((item) => item.serviceId !== serviceId);
          return {
            cartItemsDetailed: next,
            cartItems: next.length
          };
        }),
      completeBooking: ({ phone, items, total }) =>
        set((state) => {
          if (!items.length) {
            return state;
          }
          const order: CartOrder = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            reference: `CSW-${Date.now().toString().slice(-6)}`,
            phone,
            items,
            total,
            createdAt: new Date().toISOString(),
            status: 'booked'
          };
          return {
            orders: [order, ...state.orders].slice(0, 10),
            cartItems: 0,
            cartItemsDetailed: [],
            cartStage: 'confirmed'
          };
        })
    }),
    {
      name: 'csw-app-store',
      partialize: (state) => ({
        cartItems: state.cartItems,
        cartItemsDetailed: state.cartItemsDetailed,
        customerPhone: state.customerPhone,
        cartStage: state.cartStage,
        orders: state.orders
      })
    }
  )
);
