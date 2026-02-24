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

const products = [
  { id: 1, name: "Laptop HP Pavilion 15", sku: "LHP-001", category: "Electrónica", stock: 5, minStock: 20, price: 899.99, status: "low" },
  { id: 2, name: "iPhone 15 Pro Max", sku: "IPH-015", category: "Smartphones", stock: 42, minStock: 30, price: 1199.99, status: "ok" },
  { id: 3, name: "Monitor LG UltraWide 34\"", sku: "MLG-034", category: "Monitores", stock: 28, minStock: 25, price: 549.99, status: "ok" },
  { id: 4, name: "Mouse Logitech MX Master 3", sku: "MLO-003", category: "Periféricos", stock: 3, minStock: 15, price: 99.99, status: "critical" },
  { id: 5, name: "Teclado Mecánico RGB", sku: "TMR-001", category: "Periféricos", stock: 8, minStock: 25, price: 129.99, status: "low" },
  { id: 6, name: "Samsung Galaxy S24 Ultra", sku: "SGS-024", category: "Smartphones", stock: 35, minStock: 20, price: 1299.99, status: "ok" },
  { id: 7, name: "Auriculares Sony WH-1000XM5", sku: "ASO-005", category: "Audio", stock: 7, minStock: 20, price: 349.99, status: "low" },
  { id: 8, name: "iPad Pro 12.9\"", sku: "IPD-129", category: "Tablets", stock: 22, minStock: 15, price: 1099.99, status: "ok" },
  { id: 9, name: "Webcam Logitech C920", sku: "WLC-920", category: "Periféricos", stock: 0, minStock: 10, price: 79.99, status: "critical" },
  { id: 10, name: "SSD Samsung 1TB", sku: "SSD-001", category: "Almacenamiento", stock: 45, minStock: 30, price: 109.99, status: "ok" },
];

export const Productos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string, stock: number) => {
    switch (status) {
      case "critical":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
            {stock === 0 ? "Sin Stock" : "Crítico"}
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">
            Stock Bajo
          </Badge>
        );
      default:
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
            Normal
          </Badge>
        );
    }
  };

  const categories = [...new Set(products.map((p) => p.category))];

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
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Producto
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
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
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
            {filteredProducts.map((product) => (
              <TableRow
                key={product.id}
                className={cn(
                  "transition-colors",
                  product.status === "critical" && "bg-destructive/5",
                  product.status === "low" && "bg-warning/5"
                )}
              >
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-sm">
                  {product.sku}
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "font-semibold",
                      product.status === "critical" && "text-destructive",
                      product.status === "low" && "text-warning"
                    )}
                  >
                    {product.stock}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    /{product.minStock}
                  </span>
                </TableCell>
                <TableCell>{getStatusBadge(product.status, product.stock)}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}