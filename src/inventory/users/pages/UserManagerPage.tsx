import { useState } from "react";
import { Users, UserPlus, Search, ShieldCheck, Activity, Edit,UserCircle, CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUserManagers } from "../hooks/useUserManagers";
import { useDeleteUserManager } from "../hooks/useDeleteUserManager";
import { useUserManager } from "../hooks/useUserManager";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import type { UserManager } from "@/interface/userManager/userManager.interface";
import { Dialog, DialogContent} from "@/components/ui/dialog";
import { UserManagerForm } from "../ui/UserManagerForm";
import { useUserRoles } from "../hooks/useUserRoles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const UserManagerPage = () => {
  const { data: users, isLoading } = useUserManagers();
  const { mutate: deleteProvider, isPending } = useDeleteUserManager();
  const { data: userRoles, isLoading: isLoadingUserRoles } = useUserRoles();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UserManager | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { mutation } = useUserManager(editing?.id ?? "new");

  const usersList = users?.data ?? [];
  const totalUsers = usersList.length;
  const activeUsers = usersList.filter(u => u.isActive).length;
  const adminUsers = usersList.filter(u => u.Role.name === "ADMIN").length;

  const filtered = usersList.filter((u) => {
    const matchSearch = `${u.name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === "all" || u.Role.name === roleFilter;
    const matchStatus = statusFilter === "all" || 
                        (statusFilter === "active" && u.isActive) || 
                        (statusFilter === "inactive" && !u.isActive);
    return matchSearch && matchRole && matchStatus;
  });

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (user: UserManager) => {
    setEditing(user);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    toast("¿Deseas cambiar status usuario?", {
      description: "Esta acción no se puede deshacer",
      action: { label: "Cambiar", onClick: () => deleteProvider(id) },
      cancel: { label: "Cancelar", onClick: () => {}, },
    });
  };

  // --- Pagination Logic ---
  const ITEMS_PER_PAGE = 6;

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedUsers = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  if (isLoading || isLoadingUserRoles) return <CustomFullScreenLoading />;

  return (
    <div className="space-y-6 animate-fade-in">
     <div className="grid gap-6 grid-cols-1 sm:grid-cols-3 animate-slide-up p-4 mb-1" >
  
      {/* Card 1: Comunidad Total - Estilo Indigo */}
      <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-100 dark:bg-zinc-950 dark:border-indigo-900/30">
        {/* Gradiente Indigo Suave en el fondo */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-[0.03] transition-opacity group-hover:opacity-[0.06]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path 
              d="M0,80 Q20,90 40,70 T70,75 T100,40 L100,100 L0,100 Z" 
              fill="url(#gradient-indigo)" 
              stroke="#6366f1" 
              strokeWidth="1.5"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="gradient-indigo" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Usuarios Totales</p>
              <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mt-1.5">{totalUsers}</p>
            </div>
            {/* Contenedor del icono con color Indigo vibrante */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600 shadow-inner dark:bg-indigo-500/10 dark:border-indigo-800/50 transition-transform group-hover:scale-105">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2">
            <span className="flex items-center text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-800/30">
              Global
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">Usuarios registrados</span>
          </div>
        </div>
      </div>

      {/* Card 2: Sesiones Activas - Estilo Emerald Vibrante */}
      <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-emerald-100 dark:bg-zinc-950 dark:border-emerald-900/30">
        {/* Gradiente Emerald Vibrante */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-[0.03]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path 
              d="M0,50 L10,45 L20,55 L30,40 L40,50 L50,30 L60,45 L70,35 L80,55 L90,30 L100,20 L100,100 L0,100 Z" 
              fill="url(#gradient-emerald)" 
              stroke="#10b981" 
              strokeWidth="1.5"
              opacity="0.8"
            />
            <defs>
              <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sesiones Activas</p>
              <p className="text-4xl font-black tracking-tighter text-emerald-600 mt-1.5">{activeUsers}</p>
            </div>
            {/* Contenedor del icono con color Emerald vibrante */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100/50 text-emerald-600 shadow-inner dark:bg-emerald-500/10 dark:border-emerald-800/50 transition-transform group-hover:scale-110">
              <Activity className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> 
            En línea ahora
          </div>
        </div>
      </div>

      {/* Card 3: Staff de Sistema - Estilo Blue Profesional */}
      <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-100 dark:bg-zinc-950 dark:border-blue-900/30">
        {/* Gradiente Blue sutil */}
        <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-[0.02]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
            <path 
              d="M0,50 Q15,45 30,55 T60,40 T85,50 T100,20 L100,100 L0,100 Z" 
              fill="url(#gradient-blue)" 
              stroke="#3b82f6" 
              strokeWidth="1.5" 
              opacity="0.8"
            />
            <defs>
              <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Administradores</p>
              <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mt-1.5">{adminUsers}</p>
            </div>
            {/* Contenedor del icono con color Blue vibrante */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 shadow-inner dark:bg-blue-500/10 dark:border-blue-800/50 transition-transform group-hover:scale-105">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="font-bold text-blue-600">Privilegiados</span> Acceso total al sistema
          </div>
        </div>
      </div>
    </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-2xl border border-border/50 bg-background/60 backdrop-blur-xl shadow-none"
        >

          {/* SEARCH */}
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 group-focus-within:text-primary transition" />

            <Input
              placeholder="Buscar usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                pl-10 h-11 rounded-xl
                bg-muted/30 border border-transparent
                hover:bg-muted/50
                focus:bg-background
                focus:border-primary/40
                focus:ring-2 focus:ring-primary/20
                transition-all duration-200
              "
            />
          </div>

          {/* FILTROS */}
          <div className="flex gap-2 w-full sm:w-auto">

            {/* ROLE */}
             {userRoles && (
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger
                className="
                  h-11 min-w-[140px] rounded-xl
                  bg-muted/30 border border-transparent
                  hover:bg-muted/50
                  focus:ring-2 focus:ring-primary/20
                  transition-all
                "
              >
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
  
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {userRoles.data.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             )}
            {/* STATUS */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="
                  h-11 min-w-[130px] rounded-xl
                  bg-muted/30 border border-transparent
                  hover:bg-muted/50
                  focus:ring-2 focus:ring-primary/20
                  transition-all
                "
              >
                <SelectValue placeholder="Estado" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={openNew}
            className="
              h-11 px-5 rounded-xl
              bg-blue-600 text-white
              hover:bg-blue-700
              shadow-none
              transition-all active:scale-95
              flex items-center gap-2
            "
          >
            <UserPlus className="h-4 w-4" />
            Nuevo
          </Button>
        </motion.div>

      {/* User Table */}
      <div className="bg-background border border-border/50 rounded-2xl overflow-hidden">
        <Table>

          {/* HEADER */}
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border/40">
              <TableHead className="py-4 px-6 text-xs font-semibold text-muted-foreground">
                Usuario
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                Email
              </TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground">
                Rol
              </TableHead>
              <TableHead className="text-center text-xs font-semibold text-muted-foreground">
                Estado
              </TableHead>
              <TableHead className="text-right pr-6 text-xs font-semibold text-muted-foreground">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                className="
                  group
                  border-b border-border/30
                  hover:bg-muted/30
                  transition-all
                "
              >
                {/* USER */}
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    
                    {/* Avatar */}
                    <div className="
                      h-9 w-9 rounded-full 
                      bg-gradient-to-br from-primary/20 to-primary/5
                      flex items-center justify-center
                      text-primary
                    ">
                      <UserCircle className="h-5 w-5" />
                    </div>

                    <div className="flex flex-col">
                      <span className="font-medium text-foreground leading-none">
                        {user.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {user.id}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* EMAIL */}
                <TableCell className="text-muted-foreground text-sm">
                  {user.email}
                </TableCell>

                {/* ROLE */}
                <TableCell>
                  <span className="
                    inline-flex items-center
                    px-2.5 py-1 rounded-lg
                    text-xs font-medium
                    bg-muted/40 border border-border/40
                  ">
                    {user.Role.name}
                  </span>
                </TableCell>

                {/* STATUS */}
                <TableCell>
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                        user.isActive
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 text-red-600"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          user.isActive ? "bg-emerald-500" : "bg-red-500"
                        )}
                      />
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </TableCell>

                {/* ACTIONS */}
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1 opacity-70 group-hover:opacity-100 transition">

                    <Button
                      variant="ghost"
                      size="icon"
                      className="
                        h-9 w-9 rounded-lg
                        hover:bg-primary/10
                        hover:text-primary
                        transition-all
                      "
                      onClick={() => openEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={isPending}
                      className="
                        h-9 w-9 rounded-lg
                        hover:bg-destructive/10
                        hover:text-destructive
                        transition-all
                      "
                      onClick={() => handleDelete(user.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>

                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

         {/* Paginación simple al estilo UserManager */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-t border-border/40">
            <span className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="h-8 rounded-lg"
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="h-8 rounded-lg"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}

      </div>

      {/* Modal - Intacto */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          {/* <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? "Actualizar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader> */}

        {userRoles && (
          <UserManagerForm
            user={editing ?? ({ id: "new" } as UserManager)}
            roles={userRoles}
            isPending={mutation.isPending}
            onSubmit={async (data) => {
              try {
                const res = await mutation.mutateAsync({
                  ...data,
                  id: editing ? editing.id : undefined,
                });
                
                 console.log("RESPUESTA:", res);
                setDialogOpen(false);
                toast.success(editing ? 'Usuario actualizado' : 'Usuario creado correctamente', {
                  position: 'bottom-right',
                });
             
              } catch (error) {  
                console.error(error);
              }
            }}
          />
         )}
        </DialogContent>
      </Dialog> 
    </div>
  );
};

