import { useState, useMemo } from "react";
import { Search,  Filter, Edit, Trash2, Tag, PackageSearch, AlertTriangle, ArrowUpRight, Boxes,Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Link, useNavigate} from "react-router";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "@/inventory/categories/hooks/useCategories";
import { useDeleteProduct } from "../../hooks/useDeleteProduct";
import { useProviders } from "../../../providers/hooks/useProviders";
import { getFullImageUrl } from "@/lib/formatUrl";
import { toast } from "sonner";


function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;
  const colorMap: Record<string, string> = {
    "emerald-500": "#10b981",
    "blue-500": "#3b82f6",
    "rose-500": "#f43f5e"
  };
  const strokeColor = colorMap[color] || color;

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M ${areaPoints} Z`} fill={`url(#grad-${color})`} />
      <polyline points={points} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const Products = () => {
  const { data: product, isLoading } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const {data: providers, isLoading: isLoadingProviders } = useProviders();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const providersList = providers?.data ?? [];

  // Filtrado en el cliente para respuesta inmediata
  // const filteredProducts = useMemo(() => {
  //   return product?.data?.filter(p => {
  //     const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
  //                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
  //     const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
  //     return matchesSearch && matchesCategory;

  //   });
  // }, [product, searchTerm, categoryFilter]);  

  const filteredProducts = useMemo(() => {
     return product?.data?.filter(p => {
        const matchesSearch =
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
          categoryFilter === "all" || p.categoryId === categoryFilter;

        return matchesSearch && matchesCategory;
      }) ?? []; 
    }, [product, searchTerm, categoryFilter]);

    const navigate = useNavigate();

   const handleValidateProduct = () => {
    
    if (!categories?.data?.length) {
      toast.error("No puedes crear productos", {
        description: "Debes crear al menos una categoría primero",
      });
      return;
    }

    if (!providers?.data?.length) {
      toast.error("No puedes crear productos", {
        description: "Debes crear al menos un proveedor primero",
      });
      return;
    }

    navigate("/dashboard/products/new");
}; 

  const handleDelete = (id: string) => {
    toast("¿Eliminar producto?", {
      description: "Esta acción no se puede deshacer",
      action: {
        label: "Eliminar",
        onClick: () => {
          deleteProduct(id);
        },
      },
      cancel: {
        label: "Cancelar",
        onClick: () => {},
      },
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const productsList = product?.data ?? [];
  
  const stats = useMemo(() => {
     
    const totalItems = productsList.length;
    const inventoryValue = productsList.reduce((acc, p) => acc + (p.price * p.currentStock), 0);
    const lowStockCount = productsList.filter(p => p.currentStock <= p.minStock && p.currentStock > 0).length;
    
    return { totalItems, inventoryValue, lowStockCount };
   }, [productsList]);
   

  const getStatusBadge = (stock: number, minStock: number) => {
    if (stock === 0) return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100 shadow-none">Agotado</Badge>;
    if (stock <= minStock) return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-none">Stock Bajo</Badge>;
    return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-none font-medium">Bueno</Badge>;
  };

  const ITEMS_PER_PAGE = 6;

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  
  if (isLoading || isLoadingCategories || isLoadingProviders) return <CustomFullScreenLoading />;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* KPI Bento Grid - Estilo Premium */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 animate-slide-up">
        
        {/* Total Productos */}
        <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Productos</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{stats.totalItems}</p>
              </div>
              <div className="rounded-xl bg-blue-500/10 p-2.5">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-1">
                <Boxes className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium text-blue-600">Items en catálogo</span>
              </div>
              <Sparkline data={[5, 10, 8, 15, 12, 18, 20]} color="blue-500" />
            </div>
          </div>
        </div>

        {/* Valor Inventario */}
        <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Valor Capital</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">RD$ {stats.inventoryValue.toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-emerald-600">Inversión en stock</span>
              </div>
              <Sparkline data={[40, 35, 50, 45, 60, 55, 70]} color="emerald-500" />
            </div>
          </div>
        </div>

        {/* Alerta de Stock Bajo */}
        <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50 shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Stock Crítico</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{stats.lowStockCount}</p>
              </div>
              <div className="rounded-xl bg-rose-500/10 p-2.5">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-1">
                <span className={cn("text-xs font-medium", stats.lowStockCount > 0 ? "text-rose-600 animate-pulse" : "text-slate-400")}>
                  {stats.lowStockCount > 0 ? "Requiere atención" : "Stock saludable"}
                </span>
              </div>
              <Sparkline data={[2, 4, 3, 1, 5, 2, 8]} color="rose-500" />
            </div>
          </div>
        </div>
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
       
       {categories && (
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
       )}

        <Button  
          onClick={handleValidateProduct}
        className="blue-900 hover:bg-blue-800 shadow-md transition-all active:scale-95">
          
          {/* <Link to="/dashboard/products/new"> */}
            Nuevo Producto
          {/* </Link> */}
        </Button>

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
            {paginatedProducts?.length === 0 ? (
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
              paginatedProducts?.map((item) => {
                const category = categories?.data.find((cat) => cat.id === item.categoryId);
                const stockPercentage = Math.min((item.currentStock / (item.maxStock || 100)) * 100, 100);
                 const provider = providersList.find(
                      (p) => p.id === item.providerId
                    );

                return (
                  <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 min-w-[64px] overflow-hidden rounded-lg border border-gray-200 bg-gray-50 group">
                          <img
                            src={getFullImageUrl(item.imageURL)}
                            alt={item.name}
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                          <span className="text-xs font-bold text-slate-900">
                            {provider ? provider.name : "Sin proveedor"}
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
          {/* Paginación simple al estilo UserManager */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-muted/20 border-t border-border/40">
            <span className="text-xs text-muted-foreground">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="h-8 rounded-lg"
              >
                Anterior
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="h-8 rounded-lg"
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

 {/* Modal Para rellenar stock */}
      {/* <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? "Actualizar Venta" : "Rellenar Stock"}
            </DialogTitle>
          </DialogHeader>
          
          {product && (
          <RestartStockForm
            restartStock={{ productId: "new" } as CreateRestartStock}
            products={product}
            isPending={mutation.isPending}
            onSubmit={async (data) => {
              try {
                console.log("FINAL DATA:", data);

                await mutation.mutateAsync(data); // FIX REAL

                setDialogOpen(false);
                toast.success(editing ? 'Venta actualizada' : 'Stock Rellenado correctamente');
              } catch (error) {
                console.error(error);
              }
            }}
          />
          )}
        </DialogContent>
      </Dialog> */}