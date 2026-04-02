import { useState } from "react";
import { Plus, Edit, Trash2, Tags, Package, Palette, Search,  } from "lucide-react";
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

const colorOptions = [
  { value: "bg-primary/15 text-primary border-primary/25", label: "Azul" },
  { value: "bg-success/15 text-success border-success/25", label: "Verde" },
  { value: "bg-warning/15 text-warning border-warning/25", label: "Naranja" },
  { value: "bg-destructive/15 text-destructive border-destructive/25", label: "Rojo" },
  { value: "bg-chart-4/15 text-chart-4 border-chart-4/25", label: "Morado" },
  { value: "bg-chart-5/15 text-chart-5 border-chart-5/25", label: "Cyan" },
];

const getColor = (index: number) => colorOptions[index % colorOptions.length].value;

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
    <div className="space-y-6 p-2">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground text-sm">
            Gestiona y organiza el catálogo de productos de tu empresa.
          </p>
        </div>
        <Button onClick={openNew} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Nueva Categoría
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Categorías" value={categoryList.length} icon={<Tags className="text-primary" />} />
        <StatCard title="Total Productos" value={totalProducts} icon={<Package className="text-success" />} />
        <StatCard title="Promedio por Cat." value={average} icon={<Palette className="text-chart-4" />} />
      </div>

      {/* Search & View Mode */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[250px]">Categoría</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="text-center">Productos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((cat, index) => (
                <TableRow key={cat.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full", getColor(index).split(' ')[2].replace('border-', 'bg-'))} />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground">
                    {cat.description || "Sin descripción"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-semibold">
                      {getProductCountByCategory(cat.id)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(cat.isActive ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
                      {cat.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(cat)} className="h-8 w-8">
                        <Edit className="h-4 w-4 text-primary" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => handleDelete(cat.id)} 
                        disabled={isPending}
                        className="h-8 w-8"
                      >
                        <Trash2 className={cn("h-4 w-4 text-destructive", isPending && "animate-pulse")} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No se encontraron categorías.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Categoría" : "Nueva Categoría"}</DialogTitle>
          </DialogHeader>
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
                toast.success(editing ? 'Actualizada correctamente' : 'Creada correctamente');
              } catch (error) { console.error(error); }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Componente auxiliar para las tarjetas de stats
const StatCard = ({ title, value, icon }: { title: string, value: number, icon: React.ReactNode }) => (
  <div className="rounded-xl border bg-card p-6 shadow-sm flex items-center gap-4">
    <div className="p-3 bg-muted rounded-lg">{icon}</div>
    <div>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

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
