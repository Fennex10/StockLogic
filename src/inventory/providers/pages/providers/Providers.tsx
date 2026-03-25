import { useState, } from "react";
import { Search, Plus, Phone, Mail, MapPin, MoreHorizontal, Edit, Trash2, Building2, Globe } from "lucide-react";
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
import { useCategories } from "@/inventory/categories/hooks/useCategories";

export default function Proveedores() {

  const { data: providers, isLoading } = useProviders();
  const { mutate: deleteProvider, isPending} = useDeleteProvider();
  const {data: products, isLoading: isLoadingProducts} = useProducts();
    const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);

  const { mutation} = useProvider(editing?.id ?? "new"); 

  // const categoryList = categories?.data ?? [];
  // const productsList = products?.data ?? [];

//   const getProductCountByCategory = (categoryId: string) => {
//     return productsList.filter(p => p.categoryId === categoryId).length;
// };

//   const filtered = categoryList.filter((c) =>
//     c.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
  // const totalProducts = productsList.length;

  // const average =
  //   categoryList.length
  //   ? Math.round(totalProducts / categoryList.length)
  //   : 0;

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setDialogOpen(true);
  };

    const handleDelete = (id: string) => {
    toast("¿Eliminar categoría?", {
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

  if (isLoading || isLoadingProducts) return <CustomFullScreenLoading />;
  
  // const [searchTerm, setSearchTerm] = useState("");
  // const [dialogOpen, setDialogOpen] = useState(false);
  // const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // const filteredSuppliers = suppliers.filter(
  //   (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.contact.toLowerCase().includes(searchTerm.toLowerCase())
  // );

 
  // const activeCount = suppliers.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Proveedores</h1>
          <p className="text-muted-foreground">Gestiona tu red de proveedores</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20" onClick={() => { setEditingSupplier(null); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Proveedor
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 animate-slide-up">
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="rounded-xl bg-primary/10 p-3"><Building2 className="h-6 w-6 text-primary" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Total Proveedores</p>
            <p className="text-2xl font-bold">{suppliers.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="rounded-xl bg-success/10 p-3"><Globe className="h-6 w-6 text-success" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Activos</p>
            <p className="text-2xl font-bold">{activeCount}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="rounded-xl bg-warning/10 p-3"><Building2 className="h-6 w-6 text-warning" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Inactivos</p>
            <p className="text-2xl font-bold">{suppliers.length - activeCount}</p>
          </div>
        </div>
      </div>

      <div className="relative animate-slide-up" style={{ animationDelay: "100ms" }}>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar por nombre o contacto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 max-w-md" />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier, index) => (
          <div
            key={supplier.id}
            className="group rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up"
            style={{ animationDelay: `${(index + 2) * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {supplier.image ? (
                  <img src={supplier.image} alt={supplier.name} className="h-12 w-12 rounded-xl object-cover border border-border" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-chart-5/20 flex items-center justify-center border border-border">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{supplier.name}</h3>
                  <p className="text-sm text-muted-foreground">{supplier.contact}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  <DropdownMenuItem onClick={() => handleEdit(supplier)}>
                    <Edit className="mr-2 h-4 w-4" />Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(supplier.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" /><span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" /><span>{supplier.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" /><span>{supplier.city}, {supplier.country}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{supplier.category}</Badge>
                <Badge className={`text-xs ${supplier.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-muted text-muted-foreground"}`}>
                  {supplier.status === "active" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{supplier.products} productos</span>
            </div>
          </div>
        ))}
      </div>

      <SupplierFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        supplier={editingSupplier}
        onSave={handleSave}
      />
    </div>
  );
}
