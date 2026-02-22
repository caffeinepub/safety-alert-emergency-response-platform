import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CitizenDashboard from './pages/CitizenDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import RequestDetailPage from './pages/RequestDetailPage';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const authRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth',
  component: AuthPage,
});

const citizenDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/citizen-dashboard',
  component: CitizenDashboard,
});

const officerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/officer-dashboard',
  component: OfficerDashboard,
});

const requestDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request/$requestId',
  component: RequestDetailPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  citizenDashboardRoute,
  officerDashboardRoute,
  requestDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
