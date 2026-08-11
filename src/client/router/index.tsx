import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loading } from '../components/ui/Loading';

const LandingPage = lazy(() => import('../pages/LandingPage'));
const GuestExperience = lazy(() => import('../pages/GuestExperience'));
const AdminPanel = lazy(() => import('../pages/AdminPanel'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading text="Cargando..." size="lg" />}>
        <LandingPage />
      </Suspense>
    ),
  },
  {
    path: '/guest',
    element: (
      <Suspense fallback={<Loading text="Cargando..." size="lg" />}>
        <GuestExperience />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <Suspense fallback={<Loading text="Cargando..." size="lg" />}>
        <AdminPanel />
      </Suspense>
    ),
  },
]);
