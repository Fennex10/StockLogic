import { useState, useMemo } from "react";
import { Search, Plus, TrendingUp, DollarSign, ShoppingCart, Eye,Package,Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { toast } from "sonner";
import { SalesForm } from "./ui/SaleForm";
import { useSales } from "./hooks/useSales";
import { useDeleteSales } from "./hooks/useDeleteSales";
import { useProducts } from "../productos/hooks/useProducts";
import { useSale } from "./hooks/useSale";
import type { Sale } from "@/interface/sales/sale.interface";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { Navigate } from "react-router";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 6;

export const Sales = () => {
  const { data: sales, isLoading } = useSales();
  const { mutate: deleteSales } = useDeleteSales();
  const { data: products, isLoading: isLoadingProduct } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { mutation } = useSale(editing?.id ?? "new");

  // --- Data Mapping ---
// Forzamos el tipo como un arreglo de Sale para que TypeScript reconozca .filter()
// --- Data Mapping ---
// eslint-disable-next-line react-hooks/exhaustive-deps
const salesList: Sale[] = Array.isArray(sales?.data?.sales) 
  ? sales.data.sales 
  : [];
const stats = sales?.data?.stats;

const filteredSales = useMemo(() => {
  return salesList.filter((s) => {
    const matchSearch = `${s.clientName} ${s.id} ${s.Product.name}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || 
                        (statusFilter === "completed" && s.isCompleted) || 
                        (statusFilter === "pending" && !s.isCompleted);
    return matchSearch && matchStatus;
  });
}, [salesList, searchTerm, statusFilter]);

// --- Stats desde el Backend ---
const totalCompleted = stats?.totalCompleted ?? 0;
const totalRevenue = stats?.totalRevenue ?? 0;
const monthlySales = stats?.currentMonthSalesCount ?? 0;

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
  const paginatedSales = filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // --- Stats ---

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleAction = (action: string, saleId: string) => {
    toast.info(`Acción: ${action} para la orden ${saleId}`);
  };

  if (isLoading || isLoadingProduct) return <CustomFullScreenLoading />;
  if (!sales || !products) return <Navigate to='/dashboard/users' />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ventas</h1>
          <p className="text-muted-foreground text-sm">Panel de control y registro de transacciones</p>
        </div>
        <Button className="h-11 px-6 rounded-xl shadow-md bg-primary hover:bg-primary/90" onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" /> Nueva Venta
        </Button>
      </div>

      {/* KPI Cards (Estilo User Manager) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border/60 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Completadas</p>
            <p className="text-2xl font-bold">{totalCompleted }</p>
          </div>
        </div>
        
        <div className="bg-card border border-border/60 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Ingresos Totales</p>
            <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-card border border-border/60 p-5 rounded-2xl flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Ventas Mes</p>
            <p className="text-2xl font-bold">{monthlySales}</p>
          </div>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-card border border-border/60 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por cliente, ID o email..." 
            className="pl-10 h-11 rounded-xl bg-muted/20 border-muted-foreground/10" 
            value={searchTerm} 
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>

        <div className="flex bg-muted/30 p-1 rounded-xl border border-border/50">
          {["all", "completed", "pending", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
              className={cn(
                "px-4 py-1.5 text-xs font-medium rounded-lg transition-all capitalize",
                statusFilter === status 
                  ? "bg-white shadow-sm text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {status === "all" ? "Todos" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
        {/* <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="py-4 px-6">ID / Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Producto Principal</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Estado</TableHead>
              <TableHead className="text-right pr-6">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedSales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No se encontraron registros de ventas.
                </TableCell>
              </TableRow>
            ) : (
              paginatedSales.map((sale) => (
                <TableRow key={sale.id} className="group hover:bg-muted/20 transition-colors border-b border-border/40">
                  <TableCell className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-mono text-[11px] font-bold text-primary">{sale.id}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(sale.registerDate).toLocaleDateString('es-DO')}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border/50">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                          {sale.clientName.substring(0,2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm">{sale.clientName}</span>
                        <span className="text-[11px] text-muted-foreground">{sale.}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[150px]">
                        {sale.products[0]?.name || "Sin productos"}
                      </span>
                      {sale.products.length > 1 && (
                        <Badge variant="secondary" className="text-[10px] h-5">
                          +{sale.products.length - 1}
                        </Badge>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right font-bold text-sm">
                    ${sale.total.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex justify-center">
                      <div className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-wider",
                        sale.status === "completed" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                        sale.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        "bg-red-500/10 text-red-600 border-red-500/20"
                      )}>
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full animate-pulse",
                          sale.status === "completed" ? "bg-emerald-500" :
                          sale.status === "pending" ? "bg-amber-500" : "bg-red-500"
                        )} />
                        {sale.status.toUpperCase()}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem onClick={() => handleAction("view", sale.id)} className="gap-2">
                          <Eye className="h-4 w-4" /> Ver Detalle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction("pdf", sale.id)} className="gap-2">
                          <FileDown className="h-4 w-4" /> Descargar PDF
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => deleteSales(sale.id)} 
                          className="gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Eliminar Registro
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table> */}

        <Table>
  <TableHeader>
    <TableRow className="bg-muted/40">
      <TableHead className="py-4 px-6 text-xs font-semibold uppercase tracking-wider">ID / Fecha</TableHead>
      <TableHead className="text-xs font-semibold uppercase tracking-wider">Cliente</TableHead>
      <TableHead className="text-xs font-semibold uppercase tracking-wider">Producto</TableHead>
      <TableHead className="text-xs font-semibold uppercase tracking-wider text-center">Cant.</TableHead>
      <TableHead className="text-right text-xs font-semibold uppercase tracking-wider">Total</TableHead>
      <TableHead className="text-center text-xs font-semibold uppercase tracking-wider">Estado</TableHead>
      <TableHead className="text-right pr-6 text-xs font-semibold uppercase tracking-wider">Acciones</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {paginatedSales.length === 0 ? (
      <TableRow>
        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
          No se encontraron registros de ventas.
        </TableCell>
      </TableRow>
    ) : (
      paginatedSales.map((sale) => (
        <TableRow key={sale.id} className="group hover:bg-muted/20 transition-colors border-b border-border/40">
          
          {/* ID y FECHA */}
          <TableCell className="py-4 px-6">
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded w-fit">
                {sale.id.split('-')[0]}...{sale.id.split('-').pop()} 
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(sale.registerDate).toLocaleDateString('es-DO')}
              </span>
            </div>
          </TableCell>
          
          {/* CLIENTE */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9 border border-border/50 shadow-sm">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                  {sale.clientName.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold text-foreground text-sm capitalize">{sale.clientName}</span>
            </div>
          </TableCell>

          {/* PRODUCTO */}
          <TableCell>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{sale.Product.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">{sale.code}</span>
              </div>
            </div>
          </TableCell>

          {/* CANTIDAD */}
          <TableCell className="text-center">
            <Badge variant="outline" className="font-mono">{sale.quantity}</Badge>
          </TableCell>

          {/* TOTAL Y MÉTODO */}
          <TableCell className="text-right">
            <div className="flex flex-col">
              <span className="font-bold text-sm">
                RD$ {sale.totalPrice.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground uppercase">{sale.paymentMethod}</span>
            </div>
          </TableCell>

          {/* ESTADO (Basado en isCompleted) */}
          <TableCell>
            <div className="flex justify-center">
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border tracking-wider",
                sale.isCompleted 
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              )}>
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  sale.isCompleted ? "bg-emerald-500" : "bg-amber-500 animate-pulse"
                )} />
                {sale.isCompleted ? "COMPLETADO" : "PENDIENTE"}
              </div>
            </div>
          </TableCell>

          {/* ACCIONES */}
          <TableCell className="text-right pr-6">
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => handleAction("view", sale.id)}>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                onClick={() => deleteSales(sale.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))
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

      {/* Modal de Formulario */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? "Actualizar Venta" : "Registrar Nueva Venta"}
            </DialogTitle>
          </DialogHeader>
          
          <SalesForm
            sale={ ({ id: "new" } as Sale)}
            products={products}
            isPending={mutation.isPending}
            onSubmit={async (data) => {
              try {
                await mutation.mutateAsync({
                  ...data,
                  id: editing ? editing.id : undefined,
                });
                setDialogOpen(false);
                toast.success(editing ? 'Venta actualizada' : 'Venta registrada correctamente');
              } catch (error) {
                console.error(error);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
// import { useState, useMemo } from "react";
// import {
//   Search, Plus, TrendingUp, DollarSign, ShoppingCart,
//   MoreHorizontal, Eye, Send, XCircle, FileDown, Filter,
//   ChevronLeft, ChevronRight, ArrowUpRight,
//   CreditCard, Package
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu, DropdownMenuContent, DropdownMenuItem,
//   DropdownMenuSeparator, DropdownMenuTrigger
// } from "@/components/ui/dropdown-menu";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow
// } from "@/components/ui/table";
// import { toast } from "sonner";
// import { SalesForm } from "./ui/SaleForm";
// import { useSales } from "./hooks/useSales";
// import { useDeleteSales } from "./hooks/useDeleteSales";
// import { useProducts } from "../productos/hooks/useProducts";
// import { useSale } from "./hooks/useSale";
// import type { Sale } from "@/interface/sales/sale.interface";
// import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
// import { Navigate } from "react-router";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";



// // --- Mini Sparkline Component ---
// function Sparkline({ data, color }: { data: number[]; color: string }) {
//   const max = Math.max(...data);
//   const min = Math.min(...data);
//   const range = max - min || 1;
//   const w = 80;
//   const h = 28;
//   const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`).join(" ");
//   const areaPoints = `0,${h} ${points} ${w},${h}`;

//   return (
//     <svg width={w} height={h} className="overflow-visible">
//       <defs>
//         <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
//           <stop offset="0%" stopColor={`hsl(var(--${color}))`} stopOpacity="0.3" />
//           <stop offset="100%" stopColor={`hsl(var(--${color}))`} stopOpacity="0" />
//         </linearGradient>
//       </defs>
//       <polygon points={areaPoints} fill={`url(#grad-${color})`} />
//       <polyline points={points} fill="none" stroke={`hsl(var(--${color}))`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
//     </svg>
//   );
// }

// // --- Date Filter Options ---
// const dateFilters = [
//   { label: "Hoy", value: "today" },
//   { label: "7 Días", value: "7days" },
//   { label: "Mes", value: "month" },
//   { label: "Todo", value: "all" },
// ];

// const statusFilters = [
//   { label: "Todos", value: "all" },
//   { label: "Completado", value: "completed" },
//   { label: "Pendiente", value: "pending" },
//   { label: "Cancelado", value: "cancelled" },
// ];

// const ITEMS_PER_PAGE = 6;

// export const Sales = () => {

//   const { data: sales, isLoading } = useSales();
//   const { mutate: deleteSales, isPending } = useDeleteSales();
//   const { data: products, isLoading: isLoadingProduct } = useProducts();

//   const [searchTerm, setSearchTerm] = useState("");
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [editing, setEditing] = useState<Sale | null>(null);
//   const [statusFilter, setStatusFilter] = useState("all");

//   const { mutation } = useSale(editing?.id ?? "new");

//   const salesList = sales?.data.sales ?? [];
//   const statsLiast = sales?.data.stats ?? [];

//   const filtered = salesList.filter((s) => {
//     const matchSearch = `${s.name} ${s.email}`.toLowerCase().includes(searchTerm.toLowerCase());
   
//     const matchStatus = statusFilter === "all" || 
//                         (statusFilter === "active" && s.isActive) || 
//                         (statusFilter === "inactive" && !s.isActive);
//     return matchSearch && matchStatus;
//   });

  


//   const [currentPage, setCurrentPage] = useState(1);

//   // --- Computed ---
//   const filteredSales = useMemo(() => {
//     return sales.filter((sale) => {
//       const matchesSearch = sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         sale.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchesStatus = statusFilter === "all" || sale.status === statusFilter;
//       return matchesSearch && matchesStatus;
//     });
//   }, [sales, searchTerm, statusFilter]);

//   const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
//   const paginatedSales = filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   const completedSales = sales.filter(s => s.status === "completed");
//   const totalCompleted = completedSales.length;
//   const totalRevenue = completedSales.reduce((sum, s) => sum + s.total, 0);
//   const now = new Date();
//   const currentMonthSalesCount = sales.filter(s => {
//     const d = new Date(s.date);
//     return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
//   }).length;

//   // --- Handlers ---
  

//   const handleAction = (action: string, saleId: string) => {
//     switch (action) {
//       case "view": toast.info(`Viendo detalle de ${saleId}`); break;
//       case "receipt": toast.success(`Recibo reenviado para ${saleId}`); break;
//       case "cancel": toast.warning(`Orden ${saleId} cancelada`); break;
//       case "pdf": toast.success(`PDF descargado para ${saleId}`); break;
//     }
//   };

//   const getStatusBadge = (status: string) => {
//     const styles: Record<string, string> = {
//       completed: "bg-success/10 text-success border-success/20",
//       pending: "bg-warning/10 text-warning border-warning/20",
//       cancelled: "bg-destructive/10 text-destructive border-destructive/20",
//     };
//     const labels: Record<string, string> = { completed: "Completada", pending: "Pendiente", cancelled: "Cancelada" };
//     return <Badge className={`${styles[status]} text-xs font-medium`}>{labels[status]}</Badge>;
//   };

//   const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

//   const avatarColors = [
//     "bg-primary/15 text-primary",
//     "bg-success/15 text-success",
//     "bg-chart-4/15 text-chart-4",
//     "bg-chart-5/15 text-chart-5",
//     "bg-warning/15 text-warning",
//   ];

//   const getAvatarColor = (name: string) => avatarColors[name.length % avatarColors.length];

//   const openNew = () => {
//     setEditing(null);
//     setDialogOpen(true);
//   };

//   const openEdit = (sale: Sale) => {
//     setEditing(sale);
//     setDialogOpen(true);
//   };

//   const handleDelete = (id: string) => {
//     toast("¿Eliminar registro de venta?", {
//       description: "Esta acción no se puede deshacer",
//       action: { label: "Eliminar", onClick: () => deleteSales(id) },
//       cancel: { label: "Cancelar", onClick: () => {}, },
//     });
//   };

//   if (isLoading || isLoadingProduct) return <CustomFullScreenLoading />;
//   if (!sales || !products) return <Navigate to='/dashboard/users' />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground tracking-tight">Ventas</h1>
//           <p className="text-sm text-muted-foreground mt-0.5">Panel de control y registro de transacciones</p>
//         </div>
//         <Button
//           className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
//           onClick={() => openNew()}
//         >
//           <Plus className="mr-2 h-4 w-4" />
//           Nueva Venta
//         </Button>
//       </div>

//       {/* KPI Bento Grid */}
//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 animate-slide-up">
//         {/* Total Completadas */}
//         <div className="group kpi-card relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
//           <div className="flex items-start justify-between relative">
//             <div className="space-y-1">
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Completadas</p>
//               <p className="text-2xl font-bold text-foreground">{totalCompleted}</p>
//               <div className="flex items-center gap-1">
//                 <ArrowUpRight className="h-3 w-3 text-success" />
//                 <span className="text-xs font-medium text-success">Ventas exitosas</span>
//               </div>
//             </div>
//             <div className="flex flex-col items-end gap-2">
//               <div className="rounded-xl bg-success/10 p-2.5">
//                 <ShoppingCart className="h-5 w-5 text-success" />
//               </div>
//               <Sparkline data={[0, 1, 0, 2, 1, 0, totalCompleted]} color="success" />
//             </div>
//           </div>
//         </div>

//         {/* Ingresos Totales */}
//         <div className="group kpi-card relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
//           <div className="flex items-start justify-between relative">
//             <div className="space-y-1">
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ingresos Totales</p>
//               <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
//               <div className="flex items-center gap-1">
//                 <DollarSign className="h-3 w-3 text-primary" />
//                 <span className="text-xs font-medium text-primary">Revenue acumulado</span>
//               </div>
//             </div>
//             <div className="flex flex-col items-end gap-2">
//               <div className="rounded-xl bg-primary/10 p-2.5">
//                 <DollarSign className="h-5 w-5 text-primary" />
//               </div>
//               <Sparkline data={[0, 500, 200, 800, 400, 0, totalRevenue]} color="primary" />
//             </div>
//           </div>
//         </div>

//         {/* Ventas del Mes */}
//         <div className="group kpi-card relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-24 h-24 bg-chart-5/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500" />
//           <div className="flex items-start justify-between relative">
//             <div className="space-y-1">
//               <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ventas del Mes</p>
//               <p className="text-2xl font-bold text-foreground">{currentMonthSalesCount}</p>
//               <div className="flex items-center gap-1">
//                 <TrendingUp className="h-3 w-3 text-chart-5" />
//                 <span className="text-xs font-medium text-chart-5">Mes actual</span>
//               </div>
//             </div>
//             <div className="flex flex-col items-end gap-2">
//               <div className="rounded-xl bg-chart-5/10 p-2.5">
//                 <TrendingUp className="h-5 w-5 text-chart-5" />
//               </div>
//               <Sparkline data={[0, 1, 0, 0, 1, 0, currentMonthSalesCount]} color="chart-5" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Filters & Search Bar */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between animate-slide-up" style={{ animationDelay: "80ms" }}>
//         <div className="flex items-center gap-2 flex-1">
//           <div className="relative flex-1 max-w-sm">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//             <Input
//               placeholder="Buscar por ID, cliente o email..."
//               value={searchTerm}
//               onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//               className="pl-9 bg-card border-border"
//             />
//           </div>
//           <div className="hidden sm:flex items-center gap-1 rounded-xl border border-border bg-card p-1">
//             {dateFilters.map((f) => (
//               <button
//                 key={f.value}
//                 onClick={() => setDateFilter(f.value)}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
//                   dateFilter === f.value
//                     ? "bg-primary text-primary-foreground shadow-sm"
//                     : "text-muted-foreground hover:text-foreground hover:bg-muted"
//                 }`}
//               >
//                 {f.label}
//               </button>
//             ))}
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
//             {statusFilters.map((f) => (
//               <button
//                 key={f.value}
//                 onClick={() => { setStatusFilter(f.value); setCurrentPage(1); }}
//                 className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
//                   statusFilter === f.value
//                     ? "bg-primary text-primary-foreground shadow-sm"
//                     : "text-muted-foreground hover:text-foreground hover:bg-muted"
//                 }`}
//               >
//                 {f.label}
//               </button>
//             ))}
//           </div>
//           <Button variant="outline" size="icon" className="rounded-xl h-9 w-9 shrink-0">
//             <Filter className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* Sales Table */}
//       <div className="rounded-2xl border border-border bg-card overflow-hidden animate-slide-up" style={{ animationDelay: "120ms" }}>
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5">ID</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5">Fecha</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5">Cliente</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5">Productos</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5 text-right">Total</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5">Pago</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5">Estado</TableHead>
//               <TableHead className="font-semibold text-xs uppercase tracking-wider text-muted-foreground py-3.5 text-center w-12" />
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedSales.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
//                   <div className="flex flex-col items-center gap-2">
//                     <ShoppingCart className="h-8 w-8 text-muted-foreground/40" />
//                     <p>No se encontraron ventas</p>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paginatedSales.map((sale, idx) => {
//                 const PayIcon = paymentIcons[sale.paymentMethod] || CreditCard;
//                 return (
//                   <TableRow
//                     key={sale.id}
//                     className="group transition-all duration-200 hover:bg-muted/40 border-b border-border/50 last:border-0"
//                     style={{ animationDelay: `${idx * 30}ms` }}
//                   >
//                     {/* ID */}
//                     <TableCell className="font-mono text-xs font-semibold text-primary/80">{sale.id}</TableCell>

//                     {/* Date */}
//                     <TableCell>
//                       <span className="text-sm text-muted-foreground">
//                         {new Date(sale.date).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })}
//                       </span>
//                     </TableCell>

//                     {/* Customer with Avatar */}
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className={`h-8 w-8 ${getAvatarColor(sale.customer)}`}>
//                           <AvatarFallback className={`text-xs font-semibold ${getAvatarColor(sale.customer)}`}>
//                             {getInitials(sale.customer)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div className="min-w-0">
//                           <p className="text-sm font-medium text-foreground truncate">{sale.customer}</p>
//                           <p className="text-xs text-muted-foreground truncate">{sale.customerEmail}</p>
//                         </div>
//                       </div>
//                     </TableCell>

//                     {/* Products with thumbnails */}
//                     <TableCell>
//                       <div className="flex items-center gap-2">
//                         <div className="flex -space-x-1">
//                           {sale.products.slice(0, 2).map((p, i) => (
//                             <div key={i} className="h-7 w-7 rounded-lg bg-muted border-2 border-card flex items-center justify-center shrink-0">
//                               <Package className="h-3.5 w-3.5 text-muted-foreground" />
//                             </div>
//                           ))}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="text-sm text-foreground truncate max-w-[160px]">
//                             {sale.products[0]?.name}
//                           </p>
//                           {sale.products.length > 1 && (
//                             <button className="text-xs text-primary hover:underline font-medium">
//                               +{sale.products.length - 1} más
//                             </button>
//                           )}
//                         </div>
//                       </div>
//                     </TableCell>

//                     {/* Total */}
//                     <TableCell className="text-right">
//                       <span className="text-sm font-bold text-foreground">${sale.total.toLocaleString()}</span>
//                     </TableCell>

//                     {/* Payment */}
//                     <TableCell>
//                       <div className="flex items-center gap-1.5">
//                         <PayIcon className="h-3.5 w-3.5 text-muted-foreground" />
//                         <span className="text-xs text-muted-foreground">{paymentLabels[sale.paymentMethod]}</span>
//                       </div>
//                     </TableCell>

//                     {/* Status */}
//                     <TableCell>{getStatusBadge(sale.status)}</TableCell>

//                     {/* Actions */}
//                     <TableCell>
//                       <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
//                           >
//                             <MoreHorizontal className="h-4 w-4" />
//                           </Button>
//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent align="end" className="w-48 rounded-xl bg-popover">
//                           <DropdownMenuItem onClick={() => handleAction("view", sale.id)} className="gap-2 cursor-pointer">
//                             <Eye className="h-4 w-4" /> Ver Detalle
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => handleAction("receipt", sale.id)} className="gap-2 cursor-pointer">
//                             <Send className="h-4 w-4" /> Reenviar Recibo
//                           </DropdownMenuItem>
//                           <DropdownMenuItem onClick={() => handleAction("pdf", sale.id)} className="gap-2 cursor-pointer">
//                             <FileDown className="h-4 w-4" /> Descargar PDF
//                           </DropdownMenuItem>
//                           <DropdownMenuSeparator />
//                           <DropdownMenuItem onClick={() => handleAction("cancel", sale.id)} className="gap-2 cursor-pointer text-destructive focus:text-destructive">
//                             <XCircle className="h-4 w-4" /> Cancelar Orden
//                           </DropdownMenuItem>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
//             <p className="text-xs text-muted-foreground">
//               Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredSales.length)} de {filteredSales.length}
//             </p>
//             <div className="flex items-center gap-1">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 rounded-lg"
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage(p => p - 1)}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <Button
//                   key={page}
//                   variant={page === currentPage ? "default" : "ghost"}
//                   size="icon"
//                   className={`h-8 w-8 rounded-lg text-xs ${page === currentPage ? "bg-primary text-primary-foreground" : ""}`}
//                   onClick={() => setCurrentPage(page)}
//                 >
//                   {page}
//                 </Button>
//               ))}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="h-8 w-8 rounded-lg"
//                 disabled={currentPage === totalPages}
//                 onClick={() => setCurrentPage(p => p + 1)}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         )}
//       </div>
       
//        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//         <DialogContent className="max-w-2xl rounded-2xl">
//           <DialogHeader>
//             <DialogTitle className="text-xl font-bold">
//               {editing ? "Actualizar Usuario" : "Nuevo Usuario"}
//             </DialogTitle>
//           </DialogHeader>
          
//        <SalesForm
//                    sale={editing ?? ({ id: "new" } as Sale)}
//                    products={products}
//                    isPending={mutation.isPending}
//                    onSubmit={async (data) => {
//                      try {
//                        await mutation.mutateAsync({
//                          ...data,
//                          id: editing ? editing.id : undefined,
//                        });
//                        setDialogOpen(false);
//                        toast.success(editing ? 'actualizar no esta disponible' : 'Venta registrada correctamente', {
//                          position: 'bottom-right',
//                        });
//                      } catch (error) {
//                        console.error(error);
//                      }
//                    }}
//                  />
//          </DialogContent>
//       </Dialog> 
//     </div>
//   );
// }
