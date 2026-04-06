import { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Trash2,
  Activity,
  Edit,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUserManagers } from "../hooks/useUserManagers";
import { useDeleteUserManager } from "../hooks/useDeleteUserManager";
import { useUserManager } from "../hooks/useUserManager";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import type { UserManager } from "@/interface/userManager/userManager.interface";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserManagerForm } from "../ui/UserManagerForm";
import { useUserRoles } from "../hooks/useUserRoles";
import { Navigate } from "react-router";
import { cn } from "@/lib/utils";

export const UserManagerPage = () => {
  const { data: users, isLoading } = useUserManagers();
  const { mutate: deleteProvider, isPending } = useDeleteUserManager();
  const { data: userRoles, isLoading: isLoadingUserRoles } = useUserRoles();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<UserManager | null>(null);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

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
    toast("¿Eliminar usuario?", {
      description: "Esta acción no se puede deshacer",
      action: { label: "Eliminar", onClick: () => deleteProvider(id) },
      cancel: { label: "Cancelar", onClick: () => {}, },
    });
  };

  if (isLoading || isLoadingUserRoles) return <CustomFullScreenLoading />;
  if (!users || !userRoles) return <Navigate to='/dashboard/users' />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground text-sm">Administra los accesos de tu plataforma</p>
        </div>
        <Button className="h-11 px-6 rounded-xl shadow-md bg-primary hover:bg-primary/90" onClick={openNew}>
          <UserPlus className="h-4 w-4 mr-2" /> Nuevo Usuario
        </Button>
      </div> */}

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

      {/* Filters */}
      <div className="bg-card border border-border/60 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar..." 
            className="pl-10 h-11 rounded-xl bg-muted/20 border-muted-foreground/10" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
          
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl bg-muted/20 border-muted-foreground/10">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            {userRoles.data.map(role => (
              <SelectItem key={role.id} value={role.name}>{role.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44 h-11 rounded-xl bg-muted/20 border-muted-foreground/10">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
          </SelectContent>
        </Select>
         <Button className="h-11 px-6 rounded-xl shadow-md bg-primary hover:bg-primary/90" onClick={openNew}>
          <UserPlus className="h-4 w-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      {/* User Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="py-4 px-6">Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right pr-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} className="group hover:bg-muted/20 transition-colors border-b border-border/40">
                <TableCell className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <UserCircle className="h-6 w-6" />
                    </div>
                    <span className="font-semibold text-foreground">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-lg px-2.5 py-0.5 bg-muted/50 text-foreground border-border/50">
                    {user.Role.name}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    <div className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border tracking-wider",
                      user.isActive 
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                        : "bg-red-500/10 text-red-600 border-red-500/20"
                    )}>
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", user.isActive ? "bg-emerald-500" : "bg-red-500")} />
                      {user.isActive ? "ACTIVO" : "INACTIVO"}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5"
                      onClick={() => openEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                      onClick={() => handleDelete(user.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal - Intacto */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? "Actualizar Usuario" : "Nuevo Usuario"}
            </DialogTitle>
          </DialogHeader>
          <UserManagerForm
            user={editing ?? ({ id: "new" } as UserManager)}
            roles={userRoles}
            isPending={mutation.isPending}
            onSubmit={async (data) => {
              try {
                await mutation.mutateAsync({
                  ...data,
                  id: editing ? editing.id : undefined,
                });
                setDialogOpen(false);
                toast.success(editing ? 'Usuario actualizado' : 'Usuario creado', {
                  position: 'bottom-right',
                });
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </DialogContent>
      </Dialog> 
    </div>
  );
};


// import { useState,} from "react";
// import {
//   Users,
//   UserPlus,
//   Search,
//   ShieldCheck,
//   Trash2,
//   Activity,
//   Edit,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { toast } from "sonner";
// import { useUserManagers } from "../hooks/useUserManagers";
// import { useDeleteUserManager } from "../hooks/useDeleteUserManager";
// import { useUserManager } from "../hooks/useUserManager";
// import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
// import type { UserManager } from "@/interface/userManager/userManager.interface";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { UserManagerForm } from "../ui/UserManagerForm";
// import { useUserRoles } from "../hooks/useUserRoles";
// import { Navigate } from "react-router";

// export const UserManagerPage = () => {
  
//   const { data: users, isLoading } = useUserManagers();
//     const { mutate: deleteProvider, isPending} = useDeleteUserManager();
//     const {data: userRoles, isLoading: isLoadingUserRoles} = useUserRoles();
  
//     const [searchTerm, setSearchTerm] = useState("");
//     const [dialogOpen, setDialogOpen] = useState(false);
//     const [editing, setEditing] = useState<UserManager | null>(null);

//     const [roleFilter, setRoleFilter] = useState("all");
//     const [statusFilter, setStatusFilter] = useState("all");
  
//     const { mutation} = useUserManager(editing?.id ?? "new"); 
  
//     const usersList = users?.data ?? [];
    
//     const totalUsers = usersList.length;
//     const activeUsers = usersList.filter(u => u.isActive).length;
//     const adminUsers = usersList.filter((u) => u.Role.name == "ADMIN").length;
  
//      const filtered = usersList.filter((u) => {

//        u.name.toLowerCase().includes(searchTerm.toLowerCase()) 
       
//        const matchSearch = `${u.name} ${u.email} `.toLowerCase().includes(searchTerm.toLowerCase());
//        const matchRole = roleFilter === "all" || u.Role.name === roleFilter;
//        const matchStatus = statusFilter === "all" || u.isActive === Boolean(statusFilter);
//        return matchSearch && matchRole && matchStatus;
//       }
       
//     );
    
//     const openNew = () => {
//       setEditing(null);
//       setDialogOpen(true);
//     };
  
//     const openEdit = (user: UserManager) => {
//       setEditing(user);
//       setDialogOpen(true);
//     };
  
//       const handleDelete = (id: string) => {
//       toast("¿Eliminar usuario?", {
//           description: "Esta acción no se puede deshacer",
//           action: {
//           label: "Eliminar",
//           onClick: () => {
//               deleteProvider(id);
//           },
//           },
//           cancel: {
//           label: "Cancelar",
//           onClick: () => {},
//           },
//       });
//     };
    
//     if (isLoading || isLoadingUserRoles) return <CustomFullScreenLoading />;
    
//     if (!users || !userRoles) return <Navigate to='/dashboard/users' />;

//   return (
//     <div className="space-y-6 animate-fade-in">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground tracking-tight">Gestión de Usuarios</h1>
//           <p className="text-muted-foreground text-sm mt-1">Administra los accesos y permisos del equipo</p>
//         </div>
//          <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20" onClick={openNew}>
//           <UserPlus className="h-4 w-4" /> Nuevo Usuario
//           Agregar Proveedor
//         </Button>
      
//       </div>

//       {/* KPI Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <div className="glass-card p-5 flex items-center gap-4">
//           <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
//             <Users className="h-6 w-6 text-primary" />
//           </div>
//           <div>
//             <p className="text-sm text-muted-foreground">Total Usuarios</p>
//             <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
//           </div>
//         </div>
//         <div className="glass-card p-5 flex items-center gap-4">
//           <div className="h-12 w-12 rounded-2xl bg-success/10 flex items-center justify-center">
//             <Activity className="h-6 w-6 text-success" />
//           </div>
//           <div>
//             <p className="text-sm text-muted-foreground">Activos</p>
//             <p className="text-2xl font-bold text-foreground">{activeUsers}</p>
//           </div>
//         </div>
//         <div className="glass-card p-5 flex items-center gap-4">
//           <div className="h-12 w-12 rounded-2xl bg-chart-5/10 flex items-center justify-center">
//             <ShieldCheck className="h-6 w-6 text-chart-5" />
//           </div>
//           <div>
//             <p className="text-sm text-muted-foreground">Administradores</p>
//             <p className="text-2xl font-bold text-foreground">{adminUsers}</p>
//           </div>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Buscar por nombre, email o departamento..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         </div>

//         <Select value={roleFilter} onValueChange={setRoleFilter}>
//           <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Rol" /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Todos los roles</SelectItem>
//             <SelectItem value="admin">Administrador</SelectItem>
//             <SelectItem value="manager">Gerente</SelectItem>
//             <SelectItem value="editor">Editor</SelectItem>
//             <SelectItem value="viewer">Visualizador</SelectItem>
//           </SelectContent>
//         </Select>
        
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Estado" /></SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Todos</SelectItem>
//             <SelectItem value="active">Activo</SelectItem>
//             <SelectItem value="inactive">Inactivo</SelectItem>
//             <SelectItem value="suspended">Suspendido</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* User Table */}
//       <div className="glass-card overflow-hidden">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/30">
//               <TableHead>Usuario</TableHead>
//               <TableHead>Email</TableHead>
//               <TableHead>Rol</TableHead>
//               <TableHead>Departamento</TableHead>
//               <TableHead>Estado</TableHead>
//               <TableHead className="text-right">Acciones</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filtered.map((user) => {
//               // const role = roleConfig[user.role];
//               // const status = statusConfig[user.status];
//               // const RoleIcon = role.icon;
//               return (
//                 <TableRow key={user.id} className="group">
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       {/* <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary/20 to-chart-5/20 flex items-center justify-center overflow-hidden border border-border shrink-0">
//                         {user.avatar ? (
//                           <img src={user.avatar} alt="" className="h-full w-full object-cover" />
//                         ) : (
//                           <span className="text-sm font-bold text-primary">{user.firstName[0]}{user.lastName[0]}</span>
//                         )}
//                       </div> */}
//                       <span className="font-medium text-foreground">{user.name}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-muted-foreground">{user.email}</TableCell>
                 
//                   {/* <TableCell>
//                     <Badge variant="outline" className={`${role.color} gap-1 text-xs font-medium`}>
//                       <RoleIcon className="h-3 w-3" /> {role.label}
//                     </Badge>
//                   </TableCell> */}
//                   {/* <TableCell>
//                     {user.department ? (
//                       <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg">{user.department}</span>
//                     ) : "—"}
//                   </TableCell> */}
//                   {/* <TableCell>
//                     <div className="flex items-center gap-1.5">
//                       <div className={`h-2 w-2 rounded-full ${status.dot}`} />
//                       <span className="text-sm">{status.label}</span>
//                     </div>
//                   </TableCell> */}
//               <TableCell className="text-right">
//                       <div className="flex items-center gap-1">
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
//                 onClick={() => openEdit(user)}
//               >
//                 <Edit className="h-[18px] w-[18px]" />
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 size="icon" 
//                 className="h-9 w-9 text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-colors"
//                 onClick={() => handleDelete(user.id)}
//                 disabled={isPending}
//               >
//                 <Trash2 className="h-[18px] w-[18px]" />
//               </Button>
//             </div>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//         {filtered.length === 0 && (
//           <div className="p-12 text-center">
//             <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
//             <p className="text-muted-foreground">No se encontraron usuarios</p>
//           </div>
//         )}
//       </div>
      
//          {/* Formulario  */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
    
//     <DialogContent>
//         <DialogHeader>
//         <DialogTitle>
//             {editing ? "Actualizar Usuario" : "Nuevo Usuario"}
//         </DialogTitle>
//         </DialogHeader>

//         <UserManagerForm
        
//         user={editing ?? ({ id: "new" } as UserManager)}
//         roles={userRoles}
//         isPending={mutation.isPending}
//         onSubmit={async (data) => {
//             try {
//             await mutation.mutateAsync({
//                 ...data,
//                 id: editing ? editing.id : undefined,
//             });

//             setDialogOpen(false);

//             toast.success(editing ? 'Usuario actualizado correctamente' 
//                 : 'Usuario creado correctamente', {
//                 position: 'bottom-right',
//                 });

//             } catch (error) {
//             console.error(error);
//             }
//         }}
//         />
//     </DialogContent>
//     </Dialog> 

//     </div>
//   );
// }
