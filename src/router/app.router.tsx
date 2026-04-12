import { lazy } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Dashboard } from '@/inventory/dashboard/pages/Dashboard/Dashboard';
import { Configuracion } from '@/inventory/configuracion/Configuracion';
import { Products } from '@/inventory/productos/pages/products/Products';
import { Providers } from '@/inventory/providers/pages/providers/Providers';
import { Reportes } from '@/inventory/reportes/Reportes';
import { Sales } from '@/inventory/ventas/pages/Sales';
import { createBrowserRouter, Navigate} from 'react-router';
import { AuthenticatedRoute, NotAuthenticatedRoute} from './ProtectedRoutes';
import { ForgotPassword } from '@/auth/pages/forgot/ForgotPassword';
import { ProductPage } from '@/inventory/productos/ui/ProductsPage';
import { Categories } from '@/inventory/categories/pages/categories/Categories';
import { UserManagerPage } from '@/inventory/users/pages/UserManagerPage';
import { Register } from '@/auth/pages/register/Register';
import { Login } from '@/auth/pages/login/Login';
import { ResetPassword } from '@/auth/pages/reset/ResetPassword';
import { ActivateUser } from '@/auth/pages/activateUser/ActivateUser';
// import { RoleCode } from '@/auth/type/roleCode';
const AuthLayout = lazy(() => import('../auth/layout/AuthLayout'));

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
         path: 'products',
          children: [
          {
            index: true,
            element: <Products />,
          },
          {
            path: ':id',
            element: <ProductPage/>,
          },
        ],
       },

        {
         path: 'categories',
          children: [
          {
            index: true,
            element: <Categories />,
          },
        ],
       },

        {
         path: 'ventas',
          children: [
          {
            index: true,
            element: <Sales />,
          },
        ],
       },

       {
         path: 'reportes',
         element: <Reportes />,
       },
        
       {
         path: 'providers',
          children: [
          {
            index: true,
            element: <Providers />,
          },
        ],
       },

       {
         path: 'users',
          children: [
          {
            index: true,
            element: <UserManagerPage />,
          },
        ],
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
      {
        path: 'activate/user',
        element: <ActivateUser />,
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
