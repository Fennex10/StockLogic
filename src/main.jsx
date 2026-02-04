//ORIGINAL

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { StockLogicApp } from './StockLogicApp'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <StockLogicApp />
    </StrictMode>,
)

////DASHBOARD ADMIN

//import React from 'react'
//import ReactDOM from 'react-dom/client'
//import './index.css' // Si te da error, borra esta línea

//// 1. IMPORTAMOS EL LAYOUT (El Marco)
//import AdminLayout from './admin/layout/AdminLayout.jsx'

//// 2. IMPORTAMOS LA PÁGINA (El Contenido)
//import AdminDashboard from './admin/pages/dashboard/AdminDashboard.jsx'

//ReactDOM.createRoot(document.getElementById('root')).render(
//    <React.StrictMode>
//        {/* 3. USAMOS EL LAYOUT ENVOLVIENDO AL DASHBOARD */}
//        <AdminLayout>
//            <AdminDashboard />
//        </AdminLayout>
//    </React.StrictMode>,
//)

//DASHBOARD INVENTARIO

//import React from 'react'
//import ReactDOM from 'react-dom/client'
//import './index.css'

//// 1. IMPORTAMOS EL LAYOUT DE INVENTARIO
//import InventoryLayout from './inventory/layout/layout.jsx'

//// 2. IMPORTAMOS LA PÁGINA DE DASHBOARD DE INVENTARIO
//import InventoryDashboard from './inventory/pages/dashboard.jsx'

//ReactDOM.createRoot(document.getElementById('root')).render(
//    <React.StrictMode>
//        {/* 3. MOSTRAMOS EL INVENTARIO */}
//        <InventoryLayout>
//            <InventoryDashboard />
//        </InventoryLayout>
//    </React.StrictMode>,
//)