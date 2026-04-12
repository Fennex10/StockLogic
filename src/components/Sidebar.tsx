import { NavLink } from "react-router";
import { LayoutDashboard, Package, ShoppingCart, BarChart3, Truck,
  ChevronLeft, Box, Layers, Users, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/auth/store/auth.store";
import { RoleCode } from "@/auth/type/roleCode";

const navItems = [
  {
    icon: LayoutDashboard, label: "Dashboard", path: "/dashboard",
    roles: [
      RoleCode.ADMIN,
      RoleCode.SUPER_ADMIN,
      RoleCode.WAREHOUSEMAN,
      RoleCode.AUDITOR,
      RoleCode.SELLER,
    ],
  },
  {
    icon: Package, label: "Productos", path: "/dashboard/products",
    roles: [RoleCode.ADMIN, RoleCode.SUPER_ADMIN],
  },
  {
    icon: Layers, label: "Categorías", path: "/dashboard/categories",
    roles: [RoleCode.ADMIN, RoleCode.SUPER_ADMIN],
  },
  {
    icon: ShoppingCart,
    label: "Ventas",
    path: "/dashboard/ventas",
    roles: [RoleCode.SELLER],
  },
  {
    icon: BarChart3,
    label: "Reportes",
    path: "/dashboard/reportes",
    roles: [RoleCode.AUDITOR],
  },
  {
    icon: Truck,
    label: "Proveedores",
    path: "/dashboard/providers",
    roles: [RoleCode.WAREHOUSEMAN],
  },
  {
    icon: Users,
    label: "Usuarios",
    path: "/dashboard/users",
    roles: [RoleCode.ADMIN, RoleCode.SUPER_ADMIN],
  },
  {
    icon: Settings,
    label: "Configuración",
    path: "/dashboard/configuracion",
    roles: [
      RoleCode.ADMIN,
      RoleCode.SUPER_ADMIN,
      RoleCode.WAREHOUSEMAN,
      RoleCode.AUDITOR,
      RoleCode.SELLER,
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const { user, hasRole } = useAuthStore();

  
  const filteredNavItems = navItems.filter((item) =>
    item.roles.some((role) => hasRole(role))
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">

        {/* Logo */}
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

        {/* 🔥 NAV FILTRADO */}
        <nav className="flex-1 space-y-1.5 p-4">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium relative",
                  "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                  isActive && "bg-blue-50 text-blue-600"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    )}
                  />

                  {!collapsed && <span>{item.label}</span>}

                  {isActive && (
                    <div className="absolute right-0 top-1/4 h-1/2 w-1 bg-blue-600 rounded-l-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Usuario */}
        <div className="border-t border-gray-100 p-4">
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer hover:bg-gray-50",
              collapsed && "justify-center"
            )}
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-sm">
              {user?.userName.substring(0, 2).toUpperCase()}
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.userName}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.roleCode}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}