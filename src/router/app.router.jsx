import { createBrowserRouter } from 'react-router-dom'; 
import Login from '../auth/pages/login/Login';
import Register from '../auth/pages/register/Register';
import AdminLayout from '../admin/layout/AdminLayout';
import AdminDashboard from '../admin/pages/dashboard/AdminDashboard';
import InventoryLayout from '../inventory/layout/layout';
import InventoryDashboard from '../inventory/pages/dashboard';


export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/admin',
        element: (
            <AdminLayout>
                <AdminDashboard />
            </AdminLayout>
        ),
    },
    {
        path: '/inventory',
        element: (
            <InventoryLayout>
                <InventoryDashboard />
            </InventoryLayout>
        ),
    },
    
]);
