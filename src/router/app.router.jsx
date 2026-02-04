import { createBrowserRouter } from 'react-router-dom'; // O 'react-router' según lo que instalaron

// 1. IMPORTAR PANTALLAS DE ELVIN (Auth)
import Login from '../auth/pages/login/Login';
import Register from '../auth/pages/register/Register';

// 2. IMPORTAR TUS PANTALLAS (Admin, Inventory, Predictions)
// Admin
import AdminLayout from '../admin/layout/AdminLayout';
import AdminDashboard from '../admin/pages/dashboard/AdminDashboard';
// Inventory
import InventoryLayout from '../inventory/layout/layout';
import InventoryDashboard from '../inventory/pages/dashboard';


export const router = createBrowserRouter([
    // RUTAS PÚBLICAS (ELVIN)
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },

    // TUS RUTAS (PROTEGIDAS)
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