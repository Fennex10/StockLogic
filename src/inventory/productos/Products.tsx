import { useState } from "react";
import { 
  Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye, Tag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { useProducts } from "./hooks/useProducts";
import { useCategories } from "./hooks/useCategories";
import { CustomPagination } from "@/components/custom/CustomPagination";

export const Products = () => {
  
  const { data: product, isLoading } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  if (isLoading || isLoadingCategories) return <CustomFullScreenLoading />;

  const getStatusBadge = (stock: number, minStock: number) => {
    if (stock === 0) {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 shadow-sm">
          Sin Stock
        </Badge>
      );
    }
    if (stock <= minStock) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 shadow-sm">
          Stock Bajo
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm">
        Normal
      </Badge>
    );
  };

  return (
    <div className="p-1 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Productos</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona y supervisa el inventario de tu catálogo en tiempo real.
          </p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
          <Link to="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Filters Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl border bg-card/50 backdrop-blur-sm shadow-sm">
        <div className="relative md:col-span-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-muted-foreground/20 focus-visible:ring-primary"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full bg-background border-muted-foreground/20">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Categoría" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories?.data.map((category) => (
              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px] font-bold">Detalle del Producto</TableHead>
              <TableHead className="font-bold">SKU</TableHead>
              <TableHead className="font-bold">Categoría</TableHead>
              <TableHead className="font-bold text-center">Inventario</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="font-bold text-right">Precio</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product?.data?.map((item) => {
              const category = categories?.data.find((cat) => cat.id === item.categoryId);
              const isLowStock = item.currentStock <= item.minStock;

              return (
                <TableRow key={item.id} className="group transition-colors hover:bg-muted/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg border bg-muted flex-shrink-0 overflow-hidden shadow-inner">
                        <img
                          src={item.imageURL.replace(/\\/g, '/')}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=No+Image"; }}
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold truncate text-sm text-foreground">{item.name}</span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium flex items-center gap-1">
                          <Tag className="h-3 w-3" /> {category?.name || "Sin categoría"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <code className="px-2 py-1 rounded bg-muted font-mono text-xs text-muted-foreground border">
                      {item.sku}
                    </code>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    {category?.name || "—"}
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className={cn("text-sm font-bold", isLowStock ? "text-red-600" : "text-foreground")}>
                        {item.currentStock}
                      </span>
                      <span className="text-[10px] text-muted-foreground">Mín: {item.minStock}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    {getStatusBadge(item.currentStock, item.minStock)}
                  </TableCell>

                  <TableCell className="text-right font-bold text-sm text-foreground">
                    ${item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="h-4 w-4 text-blue-500" /> Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit className="h-4 w-4 text-amber-500" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                          <Trash2 className="h-4 w-4" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
        <CustomPagination totalPage={Number(product?.data) || 0} />
    </div>
  );
};

// import { useState } from "react";
// import { 
//   Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
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

//   if (isLoading || isLoadingCategories) {
//       return ( <CustomFullScreenLoading /> )
//   }

//   console.log("products:", product);
//   console.log("categories:", categories);

//   const getStatusBadge = (stock: number, minStock: number) => {

//     if (stock === 0) {
//       return (
//         <Badge className="bg-red-100 text-red-700 border-red-200">
//           Sin Stock
//         </Badge>
//       );
//     }

//     if (stock <= minStock) {
//       return (
//         <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
//           Stock Bajo
//         </Badge>
//       );
//     }

//     return (
//       <Badge className="bg-green-100 text-green-700 border-green-200">
//         Normal
//       </Badge>
//     );
//   };

//   return (
//     <div className="space-y-6">

//       {/* Header */}

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground">Productos</h1>
//           <p className="text-muted-foreground">
//             Gestiona tu catálogo de productos e inventario
//           </p>
//         </div>

//         <Button asChild className="bg-primary hover:bg-primary/90">
//           <Link to="/dashboard/productos/nuevo">
//             <Plus className="mr-2 h-4 w-4" />
//             Agregar Producto
//           </Link>
//         </Button>
//       </div>

//       {/* Filters */}

//       <div className="flex flex-col gap-4 sm:flex-row animate-slide-up">

//         <div className="relative flex-1">
//           <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

//           <Input
//             placeholder="Buscar por nombre o SKU..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="pl-9"
//           />
//         </div>

//         <Select value={categoryFilter} onValueChange={setCategoryFilter}>

//           <SelectTrigger className="w-full sm:w-[200px] bg-background">
//             <Filter className="mr-2 h-4 w-4" />
//             <SelectValue placeholder="Categoría" />
//           </SelectTrigger>

//           <SelectContent className="bg-popover">

//             <SelectItem value="all">
//               Todas las categorías
//             </SelectItem>

//            {
//               categories?.data.map((category) => (
//               <SelectItem key={category.id} value={category.id}>
//                 {category.name}
//               </SelectItem>
//             ))}

//           </SelectContent>

//         </Select>

//       </div>

//       {/* Table */}

//       <div className="rounded-2xl border border-border bg-card animate-slide-up" style={{ animationDelay: "100ms" }}>

//         <Table>

//           <TableHeader>
//             <TableRow className="hover:bg-transparent">
//               <TableHead className="font-semibold">Producto</TableHead>
//               <TableHead className="font-semibold">Imagen</TableHead>
//               <TableHead className="font-semibold">SKU</TableHead>
//               <TableHead className="font-semibold">Categoría</TableHead>
//               <TableHead className="font-semibold text-center">Stock</TableHead>
//               <TableHead className="font-semibold">Estado</TableHead>
//               <TableHead className="font-semibold text-right">Precio</TableHead>
//               <TableHead className="w-[50px]"></TableHead>
//             </TableRow>
//           </TableHeader>

//           <TableBody>

//             {            
//                product?.data?.map((product) => {

//               const category = categories?.data.find(
//                 (cat) => cat.id === product.categoryId
//               );

//               return (

//                 <TableRow
//                   key={product.id}
//                   className={cn(
//                     "transition-colors",
//                     product.currentStock <= product.minStock && "bg-red-50",
//                     product.currentStock <= product.maxStock && "bg-yellow-50"
//                   )}
//                 >

//                   <TableCell className="font-medium">
//                     {product.name}
//                   </TableCell>

//                   <TableCell>
//                     <img
//                       // src={`${product.imageURL[0]}`}
//                       // className="h-10 w-10 object-cover rounded"
//                       src={product.imageURL.replace(/\\/g, '/')} 
//                       alt={product.name}
//                       className="h-10 w-10 object-cover rounded border"
//                       onError={(e) => {
//                         e.currentTarget.src = "https://placehold.co/400x400?text=No+Image"; 
//                       }}
//                     />
//                   </TableCell>

//                   <TableCell className="text-muted-foreground font-mono text-sm">
//                     {product.sku}
//                   </TableCell>

//                   <TableCell>
//                     {category?.name || "Sin categoría"}
//                   </TableCell>

//                   <TableCell className="text-center">

//                     <span className="font-semibold">
//                       {product.currentStock}
//                     </span>

//                     <span className="text-muted-foreground text-sm">
//                       /{product.minStock}
//                     </span>

//                   </TableCell>

//                   <TableCell>
//                     {getStatusBadge(product.currentStock, product.minStock)}
//                   </TableCell>

//                   <TableCell className="text-right font-semibold">
//                     ${product.price.toFixed(2)}
//                   </TableCell>

//                   <TableCell>

//                     <DropdownMenu>

//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>

//                       <DropdownMenuContent align="end" className="bg-popover">

//                         <DropdownMenuItem>
//                           <Eye className="mr-2 h-4 w-4" />
//                           Ver detalles
//                         </DropdownMenuItem>

//                         <DropdownMenuItem>
//                           <Edit className="mr-2 h-4 w-4" />
//                           Editar
//                         </DropdownMenuItem>

//                         <DropdownMenuItem className="text-destructive">
//                           <Trash2 className="mr-2 h-4 w-4" />
//                           Eliminar
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
//        <CustomPagination totalPage={Number(product?.data)|| 0} />
//     </div>
    
//   );
// };

