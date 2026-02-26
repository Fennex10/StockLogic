import { lazy } from 'react';
import { Login } from '@/auth/pages/login/Login';
import { Register } from '@/auth/pages/register/Register';
import { MainLayout } from '@/components/layout/MainLayout';
import { Configuracion } from '@/inventory/configuracion/Configuracion';
import { DashboardPage } from '@/inventory/dashboard/pages/Dashboard/DashboardPage';
import { Productos } from '@/inventory/productos/Productos';
import { Proveedores } from '@/inventory/proveedores/Proveedores';
import { Reportes } from '@/inventory/reportes/Reportes';
import { Ventas } from '@/inventory/ventas/Ventas';
import { createBrowserRouter, Navigate} from 'react-router';
import { NotAuthenticatedRoute } from './ProtectedRoutes';
import ResetPassword from '@/auth/pages/reset/ResetPassword';
import { ForgorPassword } from '@/auth/pages/forgot/ForgotPassword';

const AuthLayout = lazy(() => import('../auth/layout/AuthLayout'));
// const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));

export const appRouter = createBrowserRouter([
  // Main routes
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
         index: true,
         element: <DashboardPage />
       },
      {
         path: 'productos',
         element: <Productos />,
       },
       {
         path: 'ventas',
         element: <Ventas />,
       },
       {
         path: 'reportes',
         element: <Reportes />,
       },
        {
         path: 'proveedores',
         element: <Proveedores />,
       },
        {
         path: 'configuracion',
         element: <Configuracion />,
       },
    ],
  },

  // Auth Routes
  {
    path: '/auth',
    element: 
            <NotAuthenticatedRoute>
                  <AuthLayout />,
            </NotAuthenticatedRoute>,
    children: [
      {
        index: true,
        element: <Navigate to="/auth/login" />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgorPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },
]);