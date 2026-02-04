import { createBrowserRouter } from 'react-router';
import Login from '../auth/pages/login/Login';
import Register from '../auth/pages/register/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);
