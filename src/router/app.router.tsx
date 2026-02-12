// import { lazy } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Configuracion } from '@/inventory/configuracion/Configuracion';
import { DashboardPage } from '@/inventory/dashboard/pages/Dashboard/DashboardPage';
import { Productos } from '@/inventory/productos/Productos';
import { Proveedores } from '@/inventory/proveedores/Proveedores';
import { Reportes } from '@/inventory/reportes/Reportes';
import { Ventas } from '@/inventory/ventas/Ventas';
import { createBrowserRouter} from 'react-router';

// const AuthLayout = lazy(() => import('./auth/layouts/AuthLayout'));
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
 
]);