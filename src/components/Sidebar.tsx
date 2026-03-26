import { NavLink } from "react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  Truck,
  Settings,
  ChevronLeft,
  Box,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/auth/store/auth.store";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "Productos", path: "/dashboard/products" },
  { icon: Layers, label: "Categorías", path: "/dashboard/categories" },
  { icon: ShoppingCart, label: "Ventas", path: "/dashboard/ventas" },
  { icon: BarChart3, label: "Reportes", path: "/dashboard/reportes" },
  { icon: Truck, label: "Proveedores", path: "/dashboard/providers" },
  { icon: Settings, label: "Configuración", path: "/dashboard/configuracion" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { user } = useAuthStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
              <Box className="h-5 w-5 text-white" />
            </div>

            {!collapsed && (
              <span className="font-bold text-gray-800 text-lg tracking-tight">
                StockLogic
              </span>
            )}
          </div>

          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium relative",
                  "text-gray-500 hover:bg-gray-50 hover:text-gray-900", // Estado Normal/Hover
                  isActive && "bg-blue-50 text-blue-600" // Estado Activo (Fondo azul suave)
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("h-5 w-5 flex-shrink-0 transition-colors", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600")} />
                  {!collapsed && <span>{item.label}</span>}
                  
                  {/* El borde lateral derecho cuando está activo */}
                  {isActive && (
                    <div className="absolute right-0 top-1/4 h-1/2 w-1 bg-blue-600 rounded-l-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-100 p-4">
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer hover:bg-gray-50",
            collapsed && "justify-center"
          )}>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm flex-shrink-0">
              {user?.userName.substring(0, 2).toUpperCase()}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.userName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.roleCode}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

// import { NavLink } from "react-router";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingCart,
//   BarChart3,
//   Truck,
//   Settings,
//   ChevronLeft,
//   Box,
// } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { useAuthStore } from "@/auth/store/auth.store";

// const navItems = [
//    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
//   { icon: Package, label: "Productos", path: "/dashboard/products" },
//   { icon: ShoppingCart, label: "Ventas", path: "/dashboard/ventas" },
//   { icon: BarChart3, label: "Reportes", path: "/dashboard/reportes" },
//   { icon: Truck, label: "Proveedores", path: "/dashboard/proveedores" },
//   { icon: Settings, label: "Configuración", path: "/dashboard/configuracion" },
// ];

// interface SidebarProps {
//   collapsed: boolean;
//   setCollapsed: (value: boolean) => void;
// }

// export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  
//    const {user} = useAuthStore();
  
//   return (
//     <aside
//       className={cn(
//         "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300",
//         collapsed ? "w-20" : "w-64"
//       )}
//     >
//       <div className="flex h-full flex-col">
//         {/* Logo */}
//         <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
//               <Box className="h-5 w-5 text-sidebar-primary-foreground" />
//             </div>

//             {!collapsed && (
//               <span className="font-semibold text-sidebar-foreground">
//                 StockLogic
//               </span>
//             )}
//           </div>

//           <button onClick={() => setCollapsed(!collapsed)}>
//             <ChevronLeft
//               className={cn(
//                 "h-5 w-5 transition-transform duration-300",
//                 collapsed && "rotate-180"
//               )}
//             />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 space-y-1 p-3">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "/"}
//               className={({ isActive }) =>
//                 cn(
//                   "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground",
//                   isActive &&
//                     "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
//                 )
//               }
//             >
//               <item.icon className="h-5 w-5 flex-shrink-0" />
//               {!collapsed && <span>{item.label}</span>}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Usuario */}
//         <div className="border-t border-sidebar-border p-4">
//           <div className="flex items-center gap-3">
//             <div className="h-9 w-9 rounded-full bg-sidebar-accent flex items-center justify-center">
//               <span className="text-sm font-medium text-sidebar-foreground">
//                 {user?.userName.substring(0,2)}
//               </span>
//             </div>

//             {!collapsed && (
//               <div className="animate-fade-in">
//                 <p className="text-sm font-medium text-sidebar-foreground">
//                   {user?.userName}
//                 </p>
//                 <p className="text-xs text-sidebar-muted">{user?.roleCode}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </aside>
//   );
// }

// import { NavLink } from "react-router";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingCart,
//   BarChart3,
//   Truck,
//   Settings,
//   ChevronLeft,
//   Box,
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// const navItems = [
//   { icon: LayoutDashboard, label: "Dashboard", path: "/" },
//   { icon: Package, label: "Productos", path: "/productos" },
//   { icon: ShoppingCart, label: "Ventas", path: "/ventas" },
//   { icon: BarChart3, label: "Reportes", path: "/reportes" },
//   { icon: Truck, label: "Proveedores", path: "/proveedores" },
//   { icon: Settings, label: "Configuración", path: "/configuracion" },
// ];

// interface SidebarProps {
//   collapsed: boolean;
//   setCollapsed: (value: boolean) => void;
// }

// export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
//   return (
//     <aside
//       className={cn(
//         "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300",
//         collapsed ? "w-20" : "w-64"
//       )}
//     >
//       <div className="flex h-full flex-col">
//         {/* Logo */}
//         <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
//               <Box className="h-5 w-5 text-sidebar-primary-foreground" />
//             </div>

//             {!collapsed && (
//               <span className="font-semibold text-sidebar-foreground">
//                 StockLogic
//               </span>
//             )}
//           </div>

//           <button onClick={() => setCollapsed(!collapsed)}>
//             <ChevronLeft
//               className={cn(
//                 "h-5 w-5 transition-transform duration-300",
//                 collapsed && "rotate-180"
//               )}
//             />
//           </button>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 space-y-1 p-3">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.path}
//               to={item.path}
//               end={item.path === "/"}
//             //   className={({ isActive }) =>
//             //     cn(
//             //       "sidebar-link",
//             //       isActive && "sidebar-link-active"
//             //     )
//             //   }
//             className={({ isActive }) =>
//                 cn(
//                     "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground",
//                     isActive &&
//                     "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
//                 )
//                 }
//             >
//               <item.icon className="h-5 w-5 flex-shrink-0" />
//               {!collapsed && <span>{item.label}</span>}
//             </NavLink>
//           ))}
//         </nav>
//       </div>
//     </aside>
//   );
// }