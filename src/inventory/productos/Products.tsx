import { useState, useMemo } from "react";
import { 
  Search, Plus, Filter, Edit, Trash2, Tag,
  PackageSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { useProducts } from "./hooks/useProducts";
import { useCategories } from "./hooks/useCategories";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useDeleteProduct } from "./hooks/useDeleteProduct";

export const Products = () => {
  const { data: product, isLoading } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Filtrado en el cliente para respuesta inmediata
  const filteredProducts = useMemo(() => {
    return product?.data?.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [product, searchTerm, categoryFilter]);

  const handleDelete = (id: string) => {
    const confirmed = window.confirm("¿Estás seguro de eliminar este producto?");
    if (confirmed) {
      deleteProduct(id);
    }
  };

  if (isLoading || isLoadingCategories) return <CustomFullScreenLoading />;

  const getStatusBadge = (stock: number, minStock: number) => {
    if (stock === 0) return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 shadow-none">Agotado</Badge>;
    if (stock <= minStock) return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-none">Stock Bajo</Badge>;
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-none font-medium">Bueno</Badge>;
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Inventario</h1>
          <p className="text-slate-500 text-sm">Monitorea niveles de stock y rendimiento de productos.</p>
        </div>
        <Button asChild className="blue-900 hover:bg-blue-800 shadow-md transition-all active:scale-95">
          <Link to="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white border-slate-200 focus:ring-2 focus:ring-slate-900/5 transition-all"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[220px] bg-white border-slate-200">
            <Filter className="h-4 w-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories?.data.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/50 text-slate-600">
            <TableRow>
              <TableHead className="w-[350px] font-semibold text-xs uppercase tracking-wider">Producto</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">SKU</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Stock</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Estado</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Precio</TableHead>
              {/* Cambiado para alinear las nuevas acciones directas */}
              <TableHead className="w-[110px] font-semibold text-xs uppercase tracking-wider text-right px-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <PackageSearch className="h-12 w-12 mb-2 opacity-20" />
                    <p className="text-sm font-medium">No se encontraron productos</p>
                    <Button variant="link" onClick={() => {setSearchTerm(""); setCategoryFilter("all")}} className="text-xs">Limpiar filtros</Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts?.map((item) => {
                const category = categories?.data.find((cat) => cat.id === item.categoryId);
                const stockPercentage = Math.min((item.currentStock / (item.maxStock || 100)) * 100, 100);

                return (
                  <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0">
                          <img
                            src={item.imageURL.replace(/\\/g, '/')}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=📦"; }}
                          />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-semibold text-sm text-slate-900 truncate">{item.name}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 uppercase font-medium">
                            <Tag className="h-3 w-3" /> {category?.name || "Sin categoría"}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {item.sku}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1.5 min-w-[100px]">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">{item.currentStock}</span>
                          <span className="text-slate-400 font-medium">/ {item.maxStock || 100}</span>
                        </div>
                        <Progress 
                          value={stockPercentage} 
                          className={cn("h-1", item.currentStock <= item.minStock ? "bg-red-100" : "bg-slate-100")}
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      {getStatusBadge(item.currentStock, item.minStock)}
                    </TableCell>

                    <TableCell className="text-right font-bold text-slate-900">
                      ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </TableCell>

                    {/* BOTONES DE ACCIÓN DIRECTOS (REEMPLAZANDO EL DROPDOWN) */}
                    <TableCell className="text-right px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          asChild
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                          title="Editar producto"
                        >
                          <Link to={`/dashboard/products/${item.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending}
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Eliminar producto"
                        >
                          <Trash2 className={cn("h-4 w-4", isPending && "animate-pulse")} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Footer / Pagination Section */}
      <div className="pt-2 flex justify-between items-center text-sm text-slate-500">
        <p>Mostrando {filteredProducts?.length || 0} productos</p>
        <CustomPagination totalPage={Number(product?.data) || 0} />
      </div>
    </div>
  );
};

// import { useState, useMemo } from "react";
// import { 
//   Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, Tag,
//    PackageSearch,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
// } from "@/components/ui/dropdown-menu";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress"; // Asumiendo que usas shadcn progress
// import { cn } from "@/lib/utils";
// import { Link } from "react-router";
// import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
// import { useProducts } from "./hooks/useProducts";
// import { useCategories } from "./hooks/useCategories";
// import { CustomPagination } from "@/components/custom/CustomPagination";
// import { useDeleteProduct } from "./hooks/useDeleteProduct";

// export const Products = () => {

//   const { data: product, isLoading } = useProducts();
//   const { data: categories, isLoading: isLoadingCategories } = useCategories();
//   const { mutate: deleteProduct, isPending } = useDeleteProduct();
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");

//   // Filtrado en el cliente para respuesta inmediata (UX Premium)
//   const filteredProducts = useMemo(() => {
//     return product?.data?.filter(p => {
//       const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
//       return matchesSearch && matchesCategory;
//     });
//   }, [product, searchTerm, categoryFilter]);

//   const handleDelete = (id: string) => {
//     // Un toque de seguridad antes de borrar
//     const confirmed = window.confirm("¿Estás seguro de eliminar este producto?");
//     if (confirmed) {
//       deleteProduct(id);
//     }
//   };

//   if (isLoading || isLoadingCategories) return <CustomFullScreenLoading />;

  

//   const getStatusBadge = (stock: number, minStock: number) => {
//     if (stock === 0) return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 shadow-none">Agotado</Badge>;
//     if (stock <= minStock) return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-none">Stock Bajo</Badge>;
//     return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-none font-medium">Bueno</Badge>;
//   };

//   return (
//     <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
//       {/* Header Section */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="space-y-1">
//           <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Inventario</h1>
//           <p className="text-slate-500 text-sm">Monitorea niveles de stock y rendimiento de productos.</p>
//         </div>
//         <Button asChild className="bg-slate-900 hover:bg-slate-800 shadow-md transition-all active:scale-95">
//           <Link to="/dashboard/products/new">
//             <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
//           </Link>
//         </Button>
//       </div>

//       {/* Filters Section */}
//       <div className="flex flex-col md:flex-row gap-4">
//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//           <Input
//             placeholder="Buscar por nombre o SKU..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 bg-white border-slate-200 focus:ring-2 focus:ring-slate-900/5 transition-all"
//           />
//         </div>
//         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//           <SelectTrigger className="w-full md:w-[220px] bg-white border-slate-200">
//             <Filter className="h-4 w-4 mr-2 text-slate-400" />
//             <SelectValue placeholder="Categoría" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Todas las categorías</SelectItem>
//             {categories?.data.map((cat) => (
//               <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Table Section */}
//       <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
//         <Table>
//           <TableHeader className="bg-slate-50/50 text-slate-600">
//             <TableRow>
//               <TableHead className="w-[350px] font-semibold text-xs uppercase tracking-wider">Producto</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider">SKU</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Stock</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider">Estado</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-right">Precio</TableHead>
//               <TableHead className="w-[80px]"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {filteredProducts?.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="h-64 text-center">
//                   <div className="flex flex-col items-center justify-center text-slate-400">
//                     <PackageSearch className="h-12 w-12 mb-2 opacity-20" />
//                     <p className="text-sm font-medium">No se encontraron productos</p>
//                     <Button variant="link" onClick={() => {setSearchTerm(""); setCategoryFilter("all")}} className="text-xs">Limpiar filtros</Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredProducts?.map((item) => {
//                 const category = categories?.data.find((cat) => cat.id === item.categoryId);
//                 const stockPercentage = Math.min((item.currentStock / (item.maxStock || 100)) * 100, 100);

//                 return (
//                   <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
//                     <TableCell>
//                       <div className="flex items-center gap-4">
//                         <div className="h-12 w-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0">
//                           <img
//                             src={item.imageURL.replace(/\\/g, '/')}
//                             alt={item.name}
//                             className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
//                             onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=📦"; }}
//                           />
//                         </div>
//                         <div className="flex flex-col overflow-hidden">
//                           <span className="font-semibold text-sm text-slate-900 truncate">{item.name}</span>
//                           <span className="text-[11px] text-slate-400 flex items-center gap-1 uppercase font-medium">
//                             <Tag className="h-3 w-3" /> {category?.name || "Sin categoría"}
//                           </span>
//                         </div>
//                       </div>
//                     </TableCell>
                    
//                     <TableCell>
//                       <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
//                         {item.sku}
//                       </span>
//                     </TableCell>

//                     <TableCell>
//                       <div className="flex flex-col gap-1.5 min-w-[100px]">
//                         <div className="flex justify-between items-center text-xs">
//                           <span className="font-bold text-slate-700">{item.currentStock}</span>
//                           <span className="text-slate-400 font-medium">/ {item.maxStock || 100}</span>
//                         </div>
//                         <Progress 
//                           value={stockPercentage} 
//                           className={cn("h-1", item.currentStock <= item.minStock ? "bg-red-100" : "bg-slate-100")}
//                         />
//                       </div>
//                     </TableCell>

//                     <TableCell>
//                       {getStatusBadge(item.currentStock, item.minStock)}
//                     </TableCell>

//                     <TableCell className="text-right font-bold text-slate-900">
//                       ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                     </TableCell>

//                     <TableCell className="text-right">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:border border-slate-200">
//                             <MoreHorizontal className="h-4 w-4 text-slate-500" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-48 shadow-xl border-slate-200">
//                           <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
//                             <Link to={`/dashboard/products/${item.id}`}>
//                               <Eye className="h-4 w-4 text-blue-500" /> Ver Detalles
//                             </Link>
//                           </DropdownMenuItem>
//                           <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2">
//                             <Link to={`/dashboard/products/${item.id}`}>
//                               <Edit className="h-4 w-4 text-amber-500" /> Editar Producto
//                             </Link>
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           {/* <DropdownMenuItem className="gap-2 text-red-600 cursor-pointer py-2 focus:bg-red-50 focus:text-red-700">
//                             <Trash2 className="h-4 w-4" /> Eliminar
//                           </DropdownMenuItem> */}
//                           <DropdownMenuItem 
//                               className="gap-2 text-destructive cursor-pointer"
//                               disabled={isPending} // Deshabilitar si se está borrando uno
//                               onClick={() => handleDelete(item.id)}
//                             >
//                               <Trash2 className="h-4 w-4" /> 
//                               {isPending ? "Eliminando..." : "Eliminar"}
//                             </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </div>
      
//       <div className="pt-2 flex justify-between items-center text-sm text-slate-500">
//         <p>Mostrando {filteredProducts?.length || 0} productos</p>
//         <CustomPagination totalPage={Number(product?.data) || 0} />
//       </div>
//     </div>
//   );
// };

// import { useState } from "react";
// import { 
//   Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, Tag,
//   PencilIcon
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
// } from "@/components/ui/dropdown-menu";
// import {
//   Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import { Link } from "react-router";
// import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
// import { useProducts } from "./hooks/useProducts";
// import { useCategories } from "./hooks/useCategories";
// import { CustomPagination } from "@/components/custom/CustomPagination";

// export const Products = () => {
  
//   const { data: product, isLoading } = useProducts();
//   const { data: categories, isLoading: isLoadingCategories } = useCategories();
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");

//   if (isLoading || isLoadingCategories) return <CustomFullScreenLoading />;

//   const getStatusBadge = (stock: number, minStock: number) => {
//     if (stock === 0) {
//       return (
//         <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 shadow-sm">
//           Sin Stock
//         </Badge>
//       );
//     }
//     if (stock <= minStock) {
//       return (
//         <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 shadow-sm">
//           Stock Bajo
//         </Badge>
//       );
//     }
//     return (
//       <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm">
//         Normal
//       </Badge>
//     );
//   };

//   return (
//     <div className="p-1 space-y-6">
//       {/* Header Section */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//         <div className="space-y-1">
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">Productos</h1>
//           <p className="text-sm text-muted-foreground">
//             Gestiona y supervisa el inventario de tu catálogo en tiempo real.
//           </p>
//         </div>
//         <Button asChild className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
//           <Link to="/dashboard/products/new">
//             <Plus className="mr-2 h-4 w-4" />
//             Nuevo Producto
//           </Link>
//         </Button>
//       </div>

//       {/* Filters Card */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
//         <div className="relative md:col-span-3">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//           <Input
//             placeholder="Buscar por nombre o SKU..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-10 bg-background border-muted-foreground/20 focus-visible:ring-primary"
//           />
//         </div>
//         <Select value={categoryFilter} onValueChange={setCategoryFilter}>
//           <SelectTrigger className="w-full bg-background border-muted-foreground/20">
//             <div className="flex items-center gap-2">
//               <Filter className="h-4 w-4 text-muted-foreground" />
//               <SelectValue placeholder="Categoría" />
//             </div>
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Todas las categorías</SelectItem>
//             {categories?.data.map((category) => (
//               <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Table Section */}
//       <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
//         <Table>
//           <TableHeader className="bg-muted/50">
//             <TableRow>
//               <TableHead className="w-[300px] font-bold">Detalle del Producto</TableHead>
//               <TableHead className="font-bold">SKU</TableHead>
//               <TableHead className="font-bold">Categoría</TableHead>
//               <TableHead className="font-bold text-center">Inventario</TableHead>
//               <TableHead className="font-bold">Estado</TableHead>
//               <TableHead className="font-bold text-right">Precio</TableHead>
//               <TableHead className="w-[50px]"></TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {product?.data?.map((item) => {
//               const category = categories?.data.find((cat) => cat.id === item.categoryId);
//               const isLowStock = item.currentStock <= item.minStock;

//               return (
//                 <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <div className="relative h-12 w-12 rounded-lg border bg-muted flex-shrink-0 overflow-hidden shadow-inner">
//                         <img
//                           src={item.imageURL.replace(/\\/g, '/')}
//                           alt={item.name}
//                           className="h-full w-full object-cover transition-transform group-hover:scale-110"
//                           onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=No+Image"; }}
//                         />
//                       </div>
//                       <div className="flex flex-col min-w-0">
//                         <span className="font-semibold truncate text-sm text-foreground">{item.name}</span>
//                         <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
//                           <Tag className="h-3 w-3" /> {category?.name || "Sin categoría"}
//                         </span>
//                       </div>
//                     </div>
//                   </TableCell>
                  
//                   <TableCell>
//                     <code className="px-2 py-1 rounded bg-muted font-mono text-xs text-muted-foreground border">
//                       {item.sku}
//                     </code>
//                   </TableCell>

//                   <TableCell className="text-muted-foreground text-sm">
//                     {category?.name || "—"}
//                   </TableCell>

//                   <TableCell className="text-center">
//                     <div className="flex flex-col items-center">
//                       <span className={cn("text-sm font-bold", isLowStock ? "text-red-600" : "text-foreground")}>
//                         {item.currentStock}
//                       </span>
//                       <span className="text-[10px] text-muted-foreground">Mín: {item.minStock}</span>
//                     </div>
//                   </TableCell>

//                   <TableCell>
//                     {getStatusBadge(item.currentStock, item.minStock)}
//                   </TableCell>

//                   <TableCell className="text-right font-bold text-sm text-foreground">
//                     ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                   </TableCell>

//                    <TableCell className="text-right">
//                 {/* <Link to={`t-shirt-teslo`}>Editar</Link> */}
//                 <Link to={`/dashboard/products/${item.id}`}>
//                   <PencilIcon className="w-4 h-4 text-blue-500" />
//                 </Link>
//               </TableCell>

//                   <TableCell>
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end" className="w-40">
//                         <DropdownMenuItem className="gap-2 cursor-pointer">
//                           <Eye className="h-4 w-4 text-blue-500" /> Ver detalles
//                         </DropdownMenuItem>
//                         <DropdownMenuItem className="gap-2 cursor-pointer">
//                           <Edit className="h-4 w-4 text-amber-500" /> Editar
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
//                           <Trash2 className="h-4 w-4" /> Eliminar
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               );
//             })}
//           </TableBody>
//         </Table>
//       </div>
      
//         <CustomPagination totalPage={Number(product?.data) || 0} />
//     </div>
//   );
// };
