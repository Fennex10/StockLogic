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
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "@/inventory/categories/hooks/useCategories";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { useProviders } from "../../../providers/hooks/useProviders";
import { getFullImageUrl } from "@/lib/formatUrl";
import { toast } from "sonner";

export const Products = () => {
  const { data: product, isLoading } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const {data: providers, isLoading: isLoadingProviders } = useProviders();
  
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
    toast("¿Eliminar producto?", {
      description: "Esta acción no se puede deshacer",
      action: {
        label: "Eliminar",
        onClick: () => {
          deleteProduct(id);
          // toast.success("Categoría eliminada correctamente");
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    });
  };

  if (isLoading || isLoadingCategories || isLoadingProviders) return <CustomFullScreenLoading />;

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
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Proveedor</TableHead>
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
                        {/* <div className="h-12 w-12 rounded-lg border border-slate-100 bg-slate-50 overflow-hidden flex-shrink-0"> */}
                        <div className="h-16 w-16 min-w-[64px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50 group">
                          <img
                            // src={`${import.meta.env.VITE_API_URL}${item.imageURL.replace(/\\/g, '/')}`}
                            src={getFullImageUrl(item.imageURL)}
                            // src={item.imageURL.replace(/\\/g, '/')}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                            // onError={(e) => { e.currentTarget.src = "https://placehold.co/400x400?text=📦"; }}
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

                      {providers?.data.map((prov) => (
                        <TableCell key={prov.id}>
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {prov.name}
                          </span>
                        </TableCell>
                      ))}

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
