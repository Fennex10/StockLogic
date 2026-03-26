import { useState, } from "react";
import { Search, Plus, Phone, Mail, MapPin, MoreHorizontal, Edit, Trash2, Building2, Globe, Package } from "lucide-react";
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona tu red de proveedores</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20" onClick={openNew}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Proveedor
        </Button>
      </div>

      {/* Stats */}

      <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">

  {/* Total */}
  <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
    <div className="rounded-xl bg-primary/10 p-3">
      <Building2 className="h-6 w-6 text-primary" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Total Proveedores</p>
      <p className="text-2xl font-bold">{totalProviders}</p>
    </div>
  </div>

  {/* Activos */}
  <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
    <div className="rounded-xl bg-success/10 p-3">
      <Globe className="h-6 w-6 text-success" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Activos</p>
      <p className="text-2xl font-bold">{activeProviders}</p>
    </div>
  </div>

  {/* Inactivos */}
  <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
    <div className="rounded-xl bg-warning/10 p-3">
      <Building2 className="h-6 w-6 text-warning" />
    </div>
    <div>
      <p className="text-sm text-muted-foreground">Inactivos</p>
      <p className="text-2xl font-bold">{inactiveProviders}</p>
    </div>
  </div>

</div>

      <div className="relative animate-slide-up" style={{ animationDelay: "100ms" }}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o contacto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 max-w-md" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((prov, index) => (
          <div
            key={prov.id}
            className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up"
            style={{ animationDelay: `${(index + 2) * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* {prov.image ? (
                  <img src={prov.image} alt={prov.name} className="h-12 w-12 rounded-xl object-cover border border-border" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-5/20 flex items-center justify-center border border-border">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                )} */}
                <div>
                  <h3 className="font-semibold text-foreground">{prov.name}</h3>
                  <p className="text-sm text-muted-foreground">{prov.contactName}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={() => openEdit(prov)}>
                    <Edit className="mr-2 h-4 w-4" />Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                      disabled={isPending}  
                      className="text-destructive" 
                      onClick={() => handleDelete(prov.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4 flex-shrink-0" /><span className="truncate">{prov.taxId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" /><span className="truncate">{prov.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" /><span>{prov.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" /><span>{prov.address}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                
               
                <Badge className={`text-xs ${prov.isActive === true ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}`}>
                  {prov.isActive === true ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{prov.productCount} productos</span>
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
