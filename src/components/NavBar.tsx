// import { RoleCode } from "@/auth/type/roleCode";
import { User} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/auth/store/auth.store";
import { Link } from "react-router";

export const Navbar = () => {

  const {authStatus, logout} = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-foreground hidden md:block">
          Gestión de Inventario StockLogic
        </h1>
      </div>

      <div className="flex items-center gap-4">

         {authStatus === "not-authenticated" ? (
            <Link to="/auth/login">
              <Button variant="default" size="sm" className="ml-2">
                Login
              </Button>
            </Link>
          ) : (
            <Button variant="outline" onClick={logout} size="sm" className="ml-2">
              Cerrar sesión
            </Button>
          )}

          {/* {hasRole(RoleCode.SUPER_ADMIN) && (
            <Link to="/admin">
              <Button variant="destructive" size="sm" className="ml-2">
                Admin
              </Button>
            </Link>
          )} */}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          
        </DropdownMenu>
      </div>
    </header>
  );
}