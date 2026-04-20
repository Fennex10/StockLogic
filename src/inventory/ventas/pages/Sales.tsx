import { useState, useMemo } from "react";
import { Search, TrendingUp, DollarSign, ShoppingCart, Package, ArrowUpRight, Check, Download, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { toast } from "sonner";
import { SalesForm } from "../ui/SaleForm";
import { useSales } from "../hooks/useSales";
import { useCompleteSales } from "../hooks/useCompleteSales";
import { useProducts } from "../../productos/hooks/useProducts";
import { useSale } from "../hooks/useSale";
import type { Sale } from "@/interface/sales/sale.interface";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/facturaPdf";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80; // Un poco más pequeño para encajar a la derecha
  const h = 24;
  
  const points = data.map((v, i) => 
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`
  ).join(" ");
  
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  const colorMap: Record<string, string> = {
    "emerald-500": "#10b981",
    "blue-500": "#3b82f6",
    "sky-500": "#0ea5e9"
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
      <polyline 
        points={points} 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export const Sales = () => {
  const { data: sales, isLoading } = useSales();
  const { mutate: completeSales } = useCompleteSales();
  const { data: products, isLoading: isLoadingProduct } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { mutation } = useSale(editing?.id ?? "new");
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
const totalCompleted = stats?.totalCompletedSales ?? 0;
const totalRevenue = stats?.totalRevenue ?? 0;
const monthlySales = stats?.currentMonthSalesCount ?? 0;

  // --- Pagination Logic ---
  const ITEMS_PER_PAGE = 6;

  const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);
  const paginatedSales = filteredSales.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const openNew = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  
  const handleValidateSales = () => {
    if (!products?.data?.length) {
      toast.error("No puedes crear ventas", {
        description: "Debes crear al menos un producto primero",
      });
      return;
    }
     openNew();
}


   if (isLoading || isLoadingProduct) return <CustomFullScreenLoading />;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* KPI Bento Grid */}
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 animate-slide-up">
      
      {/* Total Completadas */}
      <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Completadas</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">{totalCompleted}</p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-2.5">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="flex items-center gap-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              <span className="text-xs font-medium text-emerald-600">Ventas exitosas</span>
            </div>
            <div className="opacity-80">
              <Sparkline data={[10, 15, 8, 20, 18, 25, 30]} color="emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Ingresos Totales */}
      <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ingresos Totales</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">RD${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="rounded-xl bg-blue-500/10 p-2.5">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="flex items-center gap-1">
              <DollarSign className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium text-blue-600">Revenue acumulado</span>
            </div>
            <div className="opacity-80">
              <Sparkline data={[2000, 3500, 2800, 5000, 4200, 6000, 6488]} color="blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Ventas del Mes */}
      <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
        <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Ventas del Mes</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">{monthlySales}</p>
            </div>
            <div className="rounded-xl bg-sky-500/10 p-2.5">
              <TrendingUp className="h-5 w-5 text-sky-600" />
            </div>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-sky-500" />
              <span className="text-xs font-medium text-sky-600">Mes actual</span>
            </div>
            <div className="opacity-80">
              <Sparkline data={[2, 5, 3, 8, 4, 10, 8]} color="sky-500" />
            </div>
          </div>
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
          {["all", "completed", "pending"].map((status) => (
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

         
        <Button className="h-11 px-6 rounded-xl shadow-md bg-primary hover:bg-primary/90" onClick={handleValidateSales}>
           Nueva Venta
        </Button>
      
      </div>

      {/* Sales Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden shadow-sm">
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
                    {sale.code.split('-')[0]}...{sale.code.split('-').pop()} 
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
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => generateInvoicePDF(sale)}>
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </Button>

                  {sale.isCompleted ? (
                      /* Icono informativo cuando ya está completada */
                      <div className="flex h-8 w-8 items-center justify-center text-emerald-600 bg-emerald-50 rounded-lg">
                        <ShieldCheck className="h-4 w-4" /> 
                      </div>
                    ) : (
                      /* Botón de acción cuando está pendiente */
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
                        onClick={() => completeSales(sale.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}

                  {/* <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50"
                    onClick={() => completeSales(sale.id)}
                  >
                    <Check className="h-4 w-4" />
                  </Button> */}
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
          
        {products && (
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
        )}
        </DialogContent>
      </Dialog>
    </div>
  );
};