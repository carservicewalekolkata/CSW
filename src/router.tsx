import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const JobCardPage = lazy(() => import('./pages/JobCardPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const OrderEstimatePage = lazy(() => import('./pages/OrderEstimatePage'));
const OrderSummaryPage = lazy(() => import('./pages/OrderSummaryPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SchedulePickupPage = lazy(() => import('./pages/SchedulePickupPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const VehiclePage = lazy(() => import('./pages/VehiclePage'));
const WalletPage = lazy(() => import('./pages/WalletPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'services/:vehicleSlug', element: <ServicesPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'job-card', element: <JobCardPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'order-estimate', element: <OrderEstimatePage /> },
      { path: 'order-summary', element: <OrderSummaryPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'schedule-pickup', element: <SchedulePickupPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'vehicles', element: <VehiclePage /> },
      { path: 'wallet', element: <WalletPage /> },
      { path: '*', element: <NotFoundPage /> }
    ]
  },
  { path: '/home', element: <Navigate to="/" replace /> }
]);
