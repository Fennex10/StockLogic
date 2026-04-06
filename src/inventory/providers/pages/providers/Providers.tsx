import { useState, } from "react";
import { Search, Plus, Phone, Mail, MapPin, Edit, Trash2, Building2, Globe,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { toast } from "sonner";
import type { Provider } from "@/interface/providers/provider.interface";
import { useProvider } from "../../hooks/useProvider";
import { useDeleteProvider } from "../../hooks/useDeleteProvider";
import { useProviders } from "../../hooks/useProviders";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProviderForm } from "../ui/ProviderForm";

export const Providers = () => {

  const { data: providers, isLoading } = useProviders();
  const { mutate: deleteProvider, isPending} = useDeleteProvider();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);

  const { mutation} = useProvider(editing?.id ?? "new"); 

  const providersList = providers?.data ?? [];
  
  const totalProviders = providersList.length;
  const activeProviders = providersList.filter(p => p.isActive).length;
  const inactiveProviders = providersList.filter(p => !p.isActive).length;

   const filtered = providersList.filter((p) =>
     p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (prov: Provider) => {
    setEditing(prov);
    setDialogOpen(true);
  };

    const handleDelete = (id: string) => {
    toast("¿Eliminar proveedor?", {
        description: "Esta acción no se puede deshacer",
        action: {
        label: "Eliminar",
        onClick: () => {
            deleteProvider(id);
        },
        },
        cancel: {
        label: "Cancelar",
        onClick: () => {},
        },
    });
  };

  if (isLoading) return <CustomFullScreenLoading />;
  
  return (
    <div className="space-y-6">
      {/* <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona tu red de proveedores</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Proveedor
        </Button>
      </div> */}


 <div className="grid gap-6 sm:grid-cols-3 animate-slide-up">
  
  {/* Card: Total Proveedores */}
  <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-zinc-950">
    <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-20 transition-opacity group-hover:opacity-40">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <path 
          d="M0,80 Q20,90 40,70 T70,75 T100,40 L100,100 L0,100 Z" 
          fill="url(#gradient-indigo)" 
          stroke="#6366f1" 
          strokeWidth="2"
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
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Red de Suministro</p>
          <p className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white mt-1">{totalProviders}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-sm dark:bg-indigo-500/10 transition-transform group-hover:rotate-12">
          <Building2 className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        <span className="flex items-center text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full dark:bg-indigo-500/20">
          Global
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">Proveedores registrados</span>
      </div>
    </div>
  </div>

  {/* Card: Proveedores Activos */}
  <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl dark:bg-zinc-950">
    <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-20">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <path 
          d="M0,50 Q25,45 45,55 T75,40 T100,45 L100,100 L0,100 Z" 
          fill="url(#gradient-emerald)" 
          stroke="#10b981" 
          strokeWidth="2"
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
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Capacidad Activa</p>
          <p className="text-4xl font-black tracking-tighter text-emerald-600 mt-1">{activeProviders}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 shadow-sm dark:bg-emerald-500/10 transition-transform group-hover:scale-110">
          <Globe className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Operativos actualmente
      </div>
    </div>
  </div>

  {/* Card: Proveedores Inactivos (Rojo) */}
  <div className="group relative overflow-hidden rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-red-200 dark:bg-zinc-950 dark:border-red-900/30">
    <div className="absolute bottom-0 left-0 right-0 h-[40%] opacity-10 group-hover:opacity-20 transition-opacity">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <path 
          d="M0,20 Q30,40 50,30 T80,50 T100,80 L100,100 L0,100 Z" 
          fill="url(#gradient-red)" 
          stroke="#ef4444" 
          strokeWidth="2"
        />
        <defs>
          <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div className="relative z-10 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-red-500/80">Proveedores Inactivos</p>
          <p className="text-4xl font-black tracking-tighter text-red-600 mt-1">{inactiveProviders}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500 shadow-sm dark:bg-red-500/10 transition-transform group-hover:shake">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 2 20 20"/><path d="M16 8v5M9 11v1M8 8v1M20 8v1"/></svg>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-[10px] font-medium text-red-500/70">
        <span className="h-2 w-2 rounded-full bg-red-500" /> Sin actividad comercial
      </div>
    </div>
  </div>
</div>

        

<div className="flex flex-col md:flex-row gap-4 items-center animate-slide-up" style={{ animationDelay: "100ms" }}>
  
  {/* Buscador - Ahora ocupa el espacio flexible */}
  <div className="relative flex-1 w-full">
    <div className="relative flex items-center rounded-xl border border-slate-200 bg-white h-11 w-full shadow-sm focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all duration-200">
      <Search className="absolute left-4 h-4 w-4 text-slate-400" />
      <Input 
        placeholder="Buscar por nombre, contacto o identificación..." 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        className="pl-11 pr-4 h-full w-full text-sm border-none bg-transparent shadow-none focus-visible:ring-0" 
      />
    </div>
  </div>

  {/* Grupo de Acciones de Filtro */}
  <div className="flex items-center gap-2 w-full md:w-auto">
    
    {/* Botón de Filtros Avanzados */}
    <Button variant="outline" className="flex-1 md:flex-none h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 px-4">
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><path d="M21 4h-7"/><path d="M10 4H3"/><path d="M12 4v4"/><path d="M12 0v4"/><path d="M21 12H11"/><path d="M7 12H3"/><path d="M9 8v8"/><path d="M21 20H15"/><path d="M11 20H3"/><path d="M13 16v8"/></svg>
      </div>
      <span className="text-sm font-medium">Filtros</span>
    </Button>

    {/* Selector de Ordenamiento (Dropdown simple) */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex-1 md:flex-none h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 px-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
          <span className="text-sm font-medium">Ordenar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>Nombre (A-Z)</DropdownMenuItem>
        <DropdownMenuItem>Nombre (Z-A)</DropdownMenuItem>
        <DropdownMenuItem>Más productos</DropdownMenuItem>
        <DropdownMenuItem>Recientes</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

  </div>
  <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Proveedor
        </Button>
</div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {filtered.map((prov, index) => (
        <div
          key={prov.id}
          className="group relative rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
          style={{ animationDelay: `${(index + 2) * 50}ms` }}
        >
          {/* Badge de Estado - Esquina Superior Derecha */}
          <div className="absolute top-6 right-6">
            <Badge 
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                prov.isActive 
                  ? "bg-emerald-500 hover:bg-emerald-500 text-white" 
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {prov.isActive ? "Activo" : "Inactivo"}
            </Badge>
          </div>

          {/* Header: Icono y Nombre */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
              <Building2 className="h-8 w-8 text-slate-400" />
            </div>
            <div className="pr-16"> 
              <h3 className="text-lg font-bold text-slate-800 leading-tight">{prov.name}</h3>
              <p className="text-sm text-slate-500 mt-1">Contacto: {prov.contactName}</p>
            </div>
          </div>

          {/* Información de Contacto con Iconos */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-slate-600">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="text-sm truncate">{prov.email}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="text-sm">{prov.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-sm truncate">{prov.address}</span>
            </div>
          </div>

          {/* Footer: Productos y Acciones */}
          <div className="flex items-center justify-between pt-5 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Productos suministrados:</span>
              <span className="flex items-center justify-center bg-indigo-50 text-indigo-600 font-semibold text-xs px-3 py-1 rounded-full">
                {prov.productCount}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                onClick={() => openEdit(prov)}
              >
                <Edit className="h-[18px] w-[18px]" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-colors"
                onClick={() => handleDelete(prov.id)}
                disabled={isPending}
              >
                <Trash2 className="h-[18px] w-[18px]" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>

    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
    <DialogContent>
        <DialogHeader>
        <DialogTitle>
            {editing ? "Actualizar Proveedores" : "Nuevo Proveedor"}
        </DialogTitle>
        </DialogHeader>

        <ProviderForm
        provider={editing ?? ({ id: "new" } as Provider)}
        isPending={mutation.isPending}
        onSubmit={async (data) => {
            try {
            await mutation.mutateAsync({
                ...data,
                id: editing ? editing.id : undefined,
            });

            setDialogOpen(false);

            toast.success(editing ? 'Proveedor actualizado correctamente' 
                : 'Proveedor creado correctamente', {
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
}
