import { RouterProvider } from 'react-router-dom';
import { router } from './router/app.router';

export const StockLogicApp = () => {
    return (
        <RouterProvider router={router} />
    );
};