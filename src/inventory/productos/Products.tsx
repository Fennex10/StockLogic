import { useState } from "react";
import { 
  Search, Plus, Filter, MoreHorizontal, Edit, Trash2, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
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
  
  const { data, isLoading } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  if (isLoading || isLoadingCategories) {
       <div className="flex min-h-screen w-full items-center justify-center"> 
              <CustomFullScreenLoading /> 
        </div>
  }

  const getStatusBadge = (stock: number, minStock: number) => {

    if (stock === 0) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          Sin Stock
        </Badge>
      );
    }

    if (stock <= minStock) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
          Stock Bajo
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        Normal
      </Badge>
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground">
            Gestiona tu catálogo de productos e inventario
          </p>
        </div>

        <Button asChild className="bg-primary hover:bg-primary/90">
          <Link to="/dashboard/productos/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Link>
        </Button>
      </div>

      {/* Filters */}

      <div className="flex flex-col gap-4 sm:flex-row animate-slide-up">

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Buscar por nombre o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>

          <SelectTrigger className="w-full sm:w-[200px] bg-background">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>

          <SelectContent className="bg-popover">

            <SelectItem value="all">
              Todas las categorías
            </SelectItem>

           {Array.isArray(categories) &&
              categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}

          </SelectContent>

        </Select>

      </div>

      {/* Table */}

      <div className="rounded-2xl border border-border bg-card animate-slide-up" style={{ animationDelay: "100ms" }}>

        <Table>

          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold">Producto</TableHead>
              <TableHead className="font-semibold">Imagen</TableHead>
              <TableHead className="font-semibold">SKU</TableHead>
              <TableHead className="font-semibold">Categoría</TableHead>
              <TableHead className="font-semibold text-center">Stock</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold text-right">Precio</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {data?.products.map((product) => {

              const category = categories?.find(
                (cat) => cat.id === product.categoryId
              );

              return (

                <TableRow
                  key={product.id}
                  className={cn(
                    "transition-colors",
                    product.currentStock <= product.minStock && "bg-red-50",
                    product.currentStock <= product.maxStock && "bg-yellow-50"
                  )}
                >

                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>

                  <TableCell>
                    <img
                      src={`${import.meta.env.VITE_API_URL}${product.imageURL}`}
                      className="h-10 w-10 object-cover rounded"
                    />
                  </TableCell>

                  <TableCell className="text-muted-foreground font-mono text-sm">
                    {product.sku}
                  </TableCell>

                  <TableCell>
                    {category?.name || "Sin categoría"}
                  </TableCell>

                  <TableCell className="text-center">

                    <span className="font-semibold">
                      {product.currentStock}
                    </span>

                    <span className="text-muted-foreground text-sm">
                      /{product.minStock}
                    </span>

                  </TableCell>

                  <TableCell>
                    {getStatusBadge(product.currentStock, product.minStock)}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    ${product.price.toFixed(2)}
                  </TableCell>

                  <TableCell>

                    <DropdownMenu>

                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="bg-popover">

                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>

                      </DropdownMenuContent>

                    </DropdownMenu>

                  </TableCell>

                </TableRow>

              );
            })}

          </TableBody>

        </Table>

        <CustomPagination totalPage={data?.pages || 0} />

      </div>

    </div>
  );
};

