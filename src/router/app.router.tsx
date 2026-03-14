import { lazy } from 'react';
import { Login } from '@/auth/pages/login/Login';
import { Register } from '@/auth/pages/register/Register';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/inventory/dashboard/pages/Dashboard/Dashboard';
import { Configuracion } from '@/inventory/configuracion/Configuracion';
import { Products } from '@/inventory/productos/Products';
import { Proveedores } from '@/inventory/proveedores/Proveedores';
import { Reportes } from '@/inventory/reportes/Reportes';
import { Ventas } from '@/inventory/ventas/Ventas';
import { createBrowserRouter, Navigate} from 'react-router';
import { AuthenticatedRoute, NotAuthenticatedRoute} from './ProtectedRoutes';
import ResetPassword from '@/auth/pages/reset/ResetPassword';
import { ForgotPassword } from '@/auth/pages/forgot/ForgotPassword';
import { ProductPage } from '@/inventory/productos/ui/ProductsPage';
// import { RoleCode } from '@/auth/type/roleCode';
// import { ProductForm } from '@/inventory/productos/ui/ProductsForm';

const AuthLayout = lazy(() => import('../auth/layout/AuthLayout'));
// const AdminLayout = lazy(() => import('./admin/layouts/AdminLayout'));

export const appRouter = createBrowserRouter([
  // Main routes
  {
    path: '/dashboard',
    element: ( 
      <AuthenticatedRoute>
      <MainLayout />
      </AuthenticatedRoute> 
    ),

    children: [
      {
         index: true,
         element: <Dashboard />
       },
       //Products Routes
       {
         path: 'productos',
          children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: 'products/:id',
            element: <ProductPage/>,
          },
        ],
       },

      //  {
      //    path: 'productos',
      //    element: <Products />,
      //  },
      //   {
      //    path: 'productos/productForm',
      //    element: <Products />,
      //  }, 
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
         
         element: 
            // <RoleRoute role={RoleCode.ADMIN}>
            <Configuracion />,
            // </RoleRoute>
       },
    ],
  },
  
  {
  path: '/',
  element: <Navigate to="/auth/login" replace />,
  },

  // Auth Routes
  {
    path: '/auth',
    element: 
            <NotAuthenticatedRoute>
                  <AuthLayout />
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
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
  
]);

  // {
  //   path: 'productos',
  //   children: [
  //     {
  //       index: true,
  //       element: <Productos />,
  //     },
  //     {
  //       path: 'nuevo',
  //       element: <ProductForm />,
  //     },
  //   ],
  // },
