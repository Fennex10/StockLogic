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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Package, label: "Productos", path: "/productos" },
  { icon: ShoppingCart, label: "Ventas", path: "/ventas" },
  { icon: BarChart3, label: "Reportes", path: "/reportes" },
  { icon: Truck, label: "Proveedores", path: "/proveedores" },
  { icon: Settings, label: "Configuración", path: "/configuracion" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-primary">
              <Box className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>

            {!collapsed && (
              <span className="font-semibold text-sidebar-foreground">
                StockLogic
              </span>
            )}
          </div>

          <button onClick={() => setCollapsed(!collapsed)}>
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
            //   className={({ isActive }) =>
            //     cn(
            //       "sidebar-link",
            //       isActive && "sidebar-link-active"
            //     )
            //   }
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/70 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                    isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary"
                )
                }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}