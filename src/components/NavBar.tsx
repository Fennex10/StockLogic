import { Bell, Search, User} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/auth/store/auth.store";
import { Link } from "react-router";

export const Navbar = () => {

  const {authStatus, isAdmin, logout} = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground hidden md:block">
          Gestión de Inventario StockLogic
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar productos, ventas..."
            className="w-64 pl-9 bg-secondary/50 border-transparent focus:border-primary/30 focus:bg-background transition-all"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                3
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-popover">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium text-sm">Stock bajo: Laptop HP</span>
              <span className="text-xs text-muted-foreground">
                Solo quedan 5 unidades en inventario
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium text-sm">Nueva venta registrada</span>
              <span className="text-xs text-muted-foreground">
                Venta #1234 por $2,500.00
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium text-sm">Stock bajo: Mouse Logitech</span>
              <span className="text-xs text-muted-foreground">
                Solo quedan 3 unidades en inventario
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

         {(authStatus === 'not-authenticated') ? (
              <Link to="/auth/login">
              <Button variant="default" size="sm" className='ml-2'>
                Login
              </Button>
            </Link>
            ) : (
               <Button variant="outline" onClick={logout} size="sm" className='ml-2'>
                Cerrar sesion
              </Button>
            )}
            
            {isAdmin() && (
               <Link to="/admin">
              <Button variant="destructive" size="sm" className='ml-2'>
                Admin
              </Button>
            </Link>
            )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Perfil</DropdownMenuItem>
            <DropdownMenuItem>Configuración</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}