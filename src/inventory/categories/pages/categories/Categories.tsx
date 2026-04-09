import { useState, cloneElement, type ReactElement, type ReactNode, isValidElement } from "react";
import { Plus, Edit, Trash2, Tags, Package, Palette, Search, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useCategories } from "../../hooks/useCategories";
import type { Category } from "@/interface/categories/category.interface";
import { useDeleteCategory } from "../../hooks/useDeleteCategory";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { cn } from "@/lib/utils";
import { useProducts } from "@/inventory/productos/hooks/useProducts";
import { CategoryForm } from "../ui/CategoryForm";
import { useCategory } from "../../hooks/useCategory";
import { toast } from "sonner";

type IconProps = {
  className?: string;
};

// --- Componente Auxiliar: StatCard Premium ---
interface StatCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  color: "primary" | "success" | "purple";
  trend?: string;
}

const StatCard = ({ title, value, icon, color, trend }: StatCardProps) => {
  const colorMap = {
    primary: "bg-blue-500",
    success: "bg-emerald-500",
    purple: "bg-violet-500",
  };

  const selectedColor = colorMap[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-border dark:bg-zinc-950">
      <div className={cn(
        "absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.04] transition-transform duration-500 group-hover:scale-150",
        selectedColor
      )} />
      
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className={cn("rounded-xl p-2.5", selectedColor.replace('bg-', 'bg-') + "/10")}>

{isValidElement<IconProps>(icon) &&
  cloneElement(icon as ReactElement<IconProps>, {
    className: cn(
      "h-5 w-5",
      selectedColor?.split(" ")[0]?.replace("bg-", "text-")
    ),
  })}
          </div>
          {trend && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            <span className="text-[10px] font-medium text-muted-foreground uppercase">total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Configuración de Colores para la Tabla ---
const colorOptions = [
  { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-200" },
  { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-200" },
  { bg: "bg-violet-500/10", text: "text-violet-600", border: "border-violet-200" },
  { bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-200" },
  { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-200" },
];

// --- Componente Principal ---
export const Categories = () => {
  const { data: categories, isLoading } = useCategories();
  const { mutate: deleteCategory, isPending } = useDeleteCategory();
  const { data: products, isLoading: isLoadingProducts } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const { mutation } = useCategory(editing?.id ?? "new");

  const categoryList = categories?.data ?? [];
  const productsList = products?.data ?? [];

  const getProductCountByCategory = (categoryId: string) => {
    return productsList.filter((p) => p.categoryId === categoryId).length;
  };

  const filtered = categoryList.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = productsList.length;
  const average = categoryList.length ? Math.round(totalProducts / categoryList.length) : 0;

  const openNew = () => { setEditing(null); setDialogOpen(true); };
  const openEdit = (cat: Category) => { setEditing(cat); setDialogOpen(true); };

  const handleDelete = (id: string) => {
    toast("¿Eliminar categoría?", {
      description: "Esta acción no se puede deshacer",
      action: {
        label: "Eliminar",
        onClick: () => deleteCategory(id),
      },
    });
  };

  if (isLoading || isLoadingProducts) return <CustomFullScreenLoading />;

  return (
    <div className="space-y-8 p-4 animate-fade-in">

      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-3 animate-slide-up">
        <StatCard 
          title="Categorías Activas" 
          value={categoryList.length} 
          icon={<Tags />} 
          color="primary"
          trend="+12%"
        />
        <StatCard 
          title="Stock por Categoría" 
          value={totalProducts} 
          icon={<Package />} 
          color="success" 
        />
        <StatCard 
          title="Índice de Variedad" 
          value={average} 
          icon={<Palette />} 
          color="purple" 
        />
      </div>

      {/* Toolbar */}
      {/* <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl border-border/60 bg-card/50 focus-visible:ring-primary/20 transition-all"
          />
        </div>
         <Button 
          onClick={openNew} 
          className="h-11 px-6 rounded-xl shadow-md bg-primary hover:bg-primary/90 transition-all active:scale-95"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
        </Button>
      </div> */}

      <div className="flex items-center justify-between gap-4">
  <div className="relative flex-1 group"> {/* Se eliminó max-w-md para que use todo el espacio disponible */}
    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
    <Input
      placeholder="Buscar por nombre o descripción..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="pl-10 h-11 rounded-xl border-border/60 bg-card/50 focus-visible:ring-primary/20 transition-all"
    />
  </div>
  <Button 
    onClick={openNew} 
    className="h-11 px-6 rounded-xl shadow-md bg-primary hover:bg-primary/90 transition-all active:scale-95 shrink-0"
  >
    <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
  </Button>
</div>

      {/* Table Section */}
      <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden animate-slide-up">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="w-[300px] text-xs font-bold uppercase tracking-wider">Categoría</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Descripción</TableHead>
              <TableHead className="text-center text-xs font-bold uppercase tracking-wider">Productos</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-wider">Estado</TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-wider">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((cat, index) => {
                const colors = colorOptions[index % colorOptions.length];
                return (
                  <TableRow key={cat.id} className="hover:bg-muted/20 transition-colors border-border/40">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl text-[13px] font-bold shadow-sm border",
                          colors.bg, colors.text, colors.border
                        )}>
                          {cat.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-sm">{cat.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                            ID-{cat.id.substring(0, 6)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate text-sm text-muted-foreground font-medium">
                      {cat.description || "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center justify-center h-7 px-3 rounded-full bg-secondary/50 text-xs font-bold">
                        {getProductCountByCategory(cat.id)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "rounded-lg px-2 py-0.5 text-[10px] font-bold border-none shadow-none",
                        cat.isActive 
                          ? "bg-emerald-500/10 text-emerald-600" 
                          : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                      )}>
                        {cat.isActive ? "ACTIVO" : "INACTIVO"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => openEdit(cat)} 
                          className="h-8 w-8 rounded-lg hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleDelete(cat.id)} 
                          disabled={isPending}
                          className="h-8 w-8 rounded-lg hover:text-destructive hover:bg-destructive/10 transition-colors text-muted-foreground"
                        >
                          <Trash2 className={cn("h-4 w-4", isPending && "animate-pulse")} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                    <Tags className="h-8 w-8" />
                    <p className="text-sm font-medium">No se encontraron categorías.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">
              {editing ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <CategoryForm
              category={editing ?? ({ id: "new" } as Category)}
              isPending={mutation.isPending}
              onSubmit={async (data) => {
                try {
                  await mutation.mutateAsync({
                    ...data,
                    id: editing ? editing.id : undefined,
                  });
                  setDialogOpen(false);
                  toast.success(editing ? 'Categoría actualizada' : 'Categoría creada con éxito');
                } catch (error) { 
                  console.error(error);
                  toast.error("Hubo un error al procesar la solicitud");
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// import { useState } from "react";
// import { Plus, Edit, Trash2, Tags, Package, Palette, Search,  } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { 
//   Table, 
//   TableBody, 
//   TableCell, 
//   TableHead, 
//   TableHeader, 
//   TableRow 
// } from "@/components/ui/table";
// import { useCategories } from "../../hooks/useCategories";
// import type { Category } from "@/interface/categories/category.interface";
// import { useDeleteCategory } from "../../hooks/useDeleteCategory";
// import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
// import { cn } from "@/lib/utils";
// import { useProducts } from "@/inventory/productos/hooks/useProducts";
// import { CategoryForm } from "../ui/CategoryForm";
// import { useCategory } from "../../hooks/useCategory";
// import { toast } from "sonner";

// const colorOptions = [
//   { value: "bg-primary/15 text-primary border-primary/25", label: "Azul" },
//   { value: "bg-success/15 text-success border-success/25", label: "Verde" },
//   { value: "bg-warning/15 text-warning border-warning/25", label: "Naranja" },
//   { value: "bg-destructive/15 text-destructive border-destructive/25", label: "Rojo" },
//   { value: "bg-chart-4/15 text-chart-4 border-chart-4/25", label: "Morado" },
//   { value: "bg-chart-5/15 text-chart-5 border-chart-5/25", label: "Cyan" },
// ];

// const getColor = (index: number) => colorOptions[index % colorOptions.length].value;

// export const Categories = () => {
//   const { data: categories, isLoading } = useCategories();
//   const { mutate: deleteCategory, isPending } = useDeleteCategory();
//   const { data: products, isLoading: isLoadingProducts } = useProducts();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editing, setEditing] = useState<Category | null>(null);

//   const { mutation } = useCategory(editing?.id ?? "new");

//   const categoryList = categories?.data ?? [];
//   const productsList = products?.data ?? [];

//   const getProductCountByCategory = (categoryId: string) => {
//     return productsList.filter((p) => p.categoryId === categoryId).length;
//   };

//   const filtered = categoryList.filter((c) =>
//     c.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const totalProducts = productsList.length;
//   const average = categoryList.length ? Math.round(totalProducts / categoryList.length) : 0;

//   const openNew = () => { setEditing(null); setDialogOpen(true); };
//   const openEdit = (cat: Category) => { setEditing(cat); setDialogOpen(true); };

//   const handleDelete = (id: string) => {
//     toast("¿Eliminar categoría?", {
//       description: "Esta acción no se puede deshacer",
//       action: {
//         label: "Eliminar",
//         onClick: () => deleteCategory(id),
//       },
//     });
//   };

//   if (isLoading || isLoadingProducts) return <CustomFullScreenLoading />;

//   return (
//     <div className="space-y-6 p-2">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
//           <p className="text-muted-foreground text-sm">
//             Gestiona y organiza el catálogo de productos de tu empresa.
//           </p>
//         </div>
//         <Button onClick={openNew} className="shadow-sm">
//           <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
//         </Button>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <StatCard title="Total Categorías" value={categoryList.length} icon={<Tags className="text-primary" />} />
//         <StatCard title="Total Productos" value={totalProducts} icon={<Package className="text-success" />} />
//         <StatCard title="Promedio por Cat." value={average} icon={<Palette className="text-chart-4" />} />
//       </div>

//       {/* Search & View Mode */}
//       <div className="flex items-center justify-between gap-4">
//         <div className="relative flex-1 max-w-sm">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Buscar categoría..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-9"
//           />
//         </div>
//       </div>

//       {/* Table Section */}
//       <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
//         <Table>
//           <TableHeader className="bg-muted/50">
//             <TableRow>
//               <TableHead className="w-[250px]">Categoría</TableHead>
//               <TableHead>Descripción</TableHead>
//               <TableHead className="text-center">Productos</TableHead>
//               <TableHead>Estado</TableHead>
//               <TableHead className="text-right">Acciones</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filtered.length > 0 ? (
//               filtered.map((cat, index) => (
//                 <TableRow key={cat.id} className="hover:bg-muted/30 transition-colors">
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <div className={cn("w-2 h-2 rounded-full", getColor(index).split(' ')[2].replace('border-', 'bg-'))} />
//                       <span className="font-medium">{cat.name}</span>
//                     </div>
//                   </TableCell>
//                   <TableCell className="max-w-[300px] truncate text-muted-foreground">
//                     {cat.description || "Sin descripción"}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <Badge variant="secondary" className="font-semibold">
//                       {getProductCountByCategory(cat.id)}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge className={cn(cat.isActive ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
//                       {cat.isActive ? "Activo" : "Inactivo"}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex justify-end gap-2">
//                       <Button size="icon" variant="ghost" onClick={() => openEdit(cat)} className="h-8 w-8">
//                         <Edit className="h-4 w-4 text-primary" />
//                       </Button>
//                       <Button 
//                         size="icon" 
//                         variant="ghost" 
//                         onClick={() => handleDelete(cat.id)} 
//                         disabled={isPending}
//                         className="h-8 w-8"
//                       >
//                         <Trash2 className={cn("h-4 w-4 text-destructive", isPending && "animate-pulse")} />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
//                   No se encontraron categorías.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Dialog for Form */}
//       <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>{editing ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
//           </DialogHeader>
//           <CategoryForm
//             category={editing ?? ({ id: "new" } as Category)}
//             isPending={mutation.isPending}
//             onSubmit={async (data) => {
//               try {
//                 await mutation.mutateAsync({
//                   ...data,
//                   id: editing ? editing.id : undefined,
//                 });
//                 setDialogOpen(false);
//                 toast.success(editing ? 'Actualizada correctamente' : 'Creada correctamente');
//               } catch (error) { console.error(error); }
//             }}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// // Componente auxiliar para las tarjetas de stats
// const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
//   <div className="rounded-xl border bg-card p-6 shadow-sm flex items-center gap-4">
//     <div className="p-3 bg-muted rounded-lg">{icon}</div>
//     <div>
//       <p className="text-sm font-medium text-muted-foreground">{title}</p>
//       <p className="text-2xl font-bold">{value}</p>
//     </div>
//   </div>
// );

// import { useState } from "react";
// import { Plus, Edit, Trash2, Tags, Package, Palette, Search } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
// import { useCategories } from "../../hooks/useCategories";
// import type { Category } from "@/interface/categories/category.interface";
// import { useDeleteCategory } from "../../hooks/useDeleteCategory";
// import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
// import { cn } from "@/lib/utils";
// import { useProducts } from "@/inventory/productos/hooks/useProducts";
// import { CategoryForm } from "../ui/CategoryForm";
// import { useCategory } from "../../hooks/useCategory";
// import { toast } from "sonner";

// const colorOptions = [
//   { value: "bg-primary/15 text-primary border-primary/25", label: "Azul", dot: "bg-primary" },
//   { value: "bg-success/15 text-success border-success/25", label: "Verde", dot: "bg-success" },
//   { value: "bg-warning/15 text-warning border-warning/25", label: "Naranja", dot: "bg-warning" },
//   { value: "bg-destructive/15 text-destructive border-destructive/25", label: "Rojo", dot: "bg-destructive" },
//   { value: "bg-chart-4/15 text-chart-4 border-chart-4/25", label: "Morado", dot: "bg-chart-4" },
//   { value: "bg-chart-5/15 text-chart-5 border-chart-5/25", label: "Cyan", dot: "bg-chart-5" },
// ];

// const getColor = (index: number) => {
//   return colorOptions[index % colorOptions.length].value;
// };

// export const Categories = () => {
 
//   const { data: categories, isLoading } = useCategories();
//   const { mutate: deleteCategory, isPending} = useDeleteCategory();
//   const {data: products, isLoading: isLoadingProducts} = useProducts();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editing, setEditing] = useState<Category | null>(null);

//   const { mutation} = useCategory(editing?.id ?? "new"); 

//   const categoryList = categories?.data ?? [];
//   const productsList = products?.data ?? [];

//   const getProductCountByCategory = (categoryId: string) => {
//     return productsList.filter(p => p.categoryId === categoryId).length;
// };

//   const filtered = categoryList.filter((c) =>
//     c.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  
//   const totalProducts = productsList.length;

//   const average =
//     categoryList.length
//     ? Math.round(totalProducts / categoryList.length)
//     : 0;

//   const openNew = () => {
//     setEditing(null);
//     setDialogOpen(true);
//   };

//   const openEdit = (cat: Category) => {
//     setEditing(cat);
//     setDialogOpen(true);
//   };

//     const handleDelete = (id: string) => {
//     toast("¿Eliminar categoría?", {
//         description: "Esta acción no se puede deshacer",
//         action: {
//         label: "Eliminar",
//         onClick: () => {
//             deleteCategory(id);
//         },
//         },
//         cancel: {
//         label: "Cancelar",
//         onClick: () => {},
//         },
//     });
//   };

//   if (isLoading || isLoadingProducts) return <CustomFullScreenLoading />;

//   return (
//     <div className="space-y-6">

//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-2xl font-bold">Categorías</h1>
//           <p className="text-muted-foreground">
//             Organiza tus productos por categorías
//           </p>
//         </div>

//         <Button onClick={openNew}>
//           <Plus className="mr-2 h-4 w-4" />
//           Nueva Categoría
//         </Button>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 sm:grid-cols-3">

//         {/* Total categorías */}
//         <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
//           <Tags className="h-6 w-6 text-primary" />
//           <div>
//             <p className="text-sm text-muted-foreground">
//               Total Categorías
//             </p>
//             <p className="text-2xl font-bold">
//               {categoryList.length}
//             </p>
//           </div>
//         </div>

//         {/* Total productos */}
//         <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
//           <Package className="h-6 w-6 text-success" />
//           <div>
//             <p className="text-sm text-muted-foreground">
//               Total Productos
//             </p>
//             <p className="text-2xl font-bold">
//               {totalProducts}
//             </p>
//           </div>
//         </div>

//         {/* Promedio */}
//         <div className="rounded-2xl border bg-card p-5 flex items-center gap-4">
//           <Palette className="h-6 w-6 text-chart-4" />
//           <div>
//             <p className="text-sm text-muted-foreground">
//               Promedio por Categoría
//             </p>
//             <p className="text-2xl font-bold">
//               {average}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//         <Input
//           placeholder="Buscar categoría..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="pl-9 max-w-md"
//         />
//       </div>

//       {/* Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//         {filtered.map((cat, index) => (
//           <div
//             key={cat.id}
//             className="group rounded-2xl border bg-card p-5 hover:shadow-lg transition"
//           >
//             <div className="flex justify-between mb-3">
//               <Badge className={`${getColor(index)} border`}>
//                 {cat.name}
//               </Badge>

//               <div className="flex gap-1 opacity-0 group-hover:opacity-100">
//                 <Button size="icon" variant="ghost" onClick={() => openEdit(cat)}>
//                   <Edit className="h-4 w-4" />
//                 </Button>

//                 <Button 
//                   size="icon" 
//                   variant="ghost"
//                  disabled={isPending} 
//                   onClick={() => handleDelete(cat.id)}>
//                   {/* <Trash2 className="h-4 w-4 text-destructive" /> */}
//                    <Trash2 className={cn("h-4 w-4 text-destructive", isPending && "animate-pulse")} />
//                 </Button>
//               </div>
//             </div>

//             <p className="text-sm text-muted-foreground mb-4">
//               {cat.description}
//             </p>

//             <div className="flex items-center gap-2 border-t pt-3">
//               <Package className="h-4 w-4" />
//               <span>{getProductCountByCategory(cat.id)} productos</span>
//             </div>
//           </div>
//         ))}
//       </div>

//     <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//     <DialogContent>
//         <DialogHeader>
//         <DialogTitle>
//             {editing ? "Editar Categoría" : "Nueva Categoría"}
//         </DialogTitle>
//         </DialogHeader>

//         <CategoryForm
//         category={editing ?? ({ id: "new" } as Category)}
//         isPending={mutation.isPending}
//         onSubmit={async (data) => {
//             try {
//             await mutation.mutateAsync({
//                 ...data,
//                 id: editing ? editing.id : undefined,
//             });

//             setDialogOpen(false);

//             toast.success(editing ? 'Categoria actualizada correctamente' 
//                 : 'Categoria creada correctamente', {
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
