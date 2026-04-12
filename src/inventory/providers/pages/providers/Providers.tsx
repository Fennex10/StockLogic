import { useState, } from "react";
import { Search, Phone, Mail, MapPin, Edit, Trash2, Building2, Globe, Ban, Activity, Users, ShieldCheck, TrendingUp, DollarSign, Wallet,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { toast } from "sonner";
import type { Provider } from "@/interface/providers/provider.interface";
import { useProvider } from "../../hooks/useProvider";
import { useDeleteProvider } from "../../hooks/useDeleteProvider";
import { useProviders } from "../../hooks/useProviders";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProviderForm } from "../ui/ProviderForm";
import { RestartStockForm } from "@/inventory/providers/pages/ui/RestartStockForm";
import type { CreateRestartStock } from "@/interface/providers/create-restart-stock";
import { useProducts } from "@/inventory/productos/hooks/useProducts";
import { useRestartStock } from "../../hooks/useRestartStock";
import type { Sale } from "@/interface/sales/sale.interface";
import { useSales } from "@/inventory/ventas/hooks/useSales";


function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 24;
  
  const points = data.map((v, i) => 
    `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`
  ).join(" ");
  
  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-prov-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M ${areaPoints} Z`} fill={`url(#grad-prov-${color})`} />
      <polyline 
        points={points} 
        fill="none" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export const Providers = () => {

  const { data: providers, isLoading } = useProviders();
  const { data: product, isLoading: isLoadingProduct } = useProducts();
  const { mutate: deleteProvider, isPending} = useDeleteProvider();
  const { data: sales, isLoading: isLoadingSales } = useSales();

  const [searchTerm, setSearchTerm] = useState("");
  // const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStockOpen, setDialogStockOpen] = useState(false);
  const [dialogProviderOpen, setDialogProviderOpen] = useState(false);
  const [editing, setEditing] = useState<Provider | null>(null);
  const [editingStock] = useState<Sale | null>(null);

  const { mutation} = useProvider(editing?.id ?? "new"); 
  const { mutation: mutationStock } = useRestartStock(editingStock?.productId ?? "new");
  
  const providersList = providers?.data ?? [];
  
  const totalProviders = providersList.length;
  const activeProviders = providersList.filter(p => p.isActive).length;
  const inactiveProviders = providersList.filter(p => !p.isActive).length;
  const totalInvestment = sales?.data.stats.totalInvestment ?? 0;
  const netProfit = sales?.data.stats.netProfit ?? 0;
  const status = sales?.data.stats.status ?? '';
  

   const filtered = providersList.filter((p) =>
     p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const openNewRestarStock = () => {
    setEditing(null);
    setDialogStockOpen(true);
  };

  const openNewProvider = () => {
    setEditing(null);
    setDialogProviderOpen(true);
  };

  const openEdit = (prov: Provider) => {
    setEditing(prov);
    setDialogProviderOpen(true);
  };

    const handleDelete = (id: string) => {
    toast("¿Eliminar proveedor?", {
        description: "Esta acción no se puede deshacer",
        action: {
        label: "Eliminar",
        onClick: () => {
            deleteProvider(id);
        },
        },
        cancel: {
        label: "Cancelar",
        onClick: () => {},
        },
    });
  };

  if (isLoading || isLoadingProduct || isLoadingSales) return <CustomFullScreenLoading />;
  
  return (
    <div className="space-y-6">

{/* KPI Bento Grid - 6 Stats */}
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 animate-slide-up">
  
  {/* 1. Total Proveedores */}
  <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Red de Suministro</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{totalProviders}</p>
        </div>
        <div className="rounded-xl bg-indigo-500/10 p-2.5 transition-transform group-hover:rotate-12">
          <Building2 className="h-5 w-5 text-indigo-600" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3 text-indigo-500" />
          <span className="text-xs font-medium text-indigo-600">Registrados</span>
        </div>
        <div className="opacity-80">
          <Sparkline data={[totalProviders-2, totalProviders-1, totalProviders]} color="#6366f1" />
        </div>
      </div>
    </div>
  </div>

  {/* 2. Proveedores Activos */}
  <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Capacidad Activa</p>
          <p className="text-3xl font-bold tracking-tight text-emerald-600">{activeProviders}</p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 p-2.5">
          <Globe className="h-5 w-5 text-emerald-600" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-emerald-600">Operativos</span>
        </div>
        <div className="opacity-80">
          <Sparkline data={[10, 12, 11, 13, 12, 14, activeProviders]} color="#10b981" />
        </div>
      </div>
    </div>
  </div>

  {/* 3. Proveedores Inactivos */}
  <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-red-100/50">
    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-wider">Fuera de Servicio</p>
          <p className="text-3xl font-bold tracking-tight text-red-600">{inactiveProviders}</p>
        </div>
        <div className="rounded-xl bg-red-500/10 p-2.5 transition-all group-hover:bg-red-500/20">
          <Ban className="h-5 w-5 text-red-600" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div className="flex items-center gap-1">
          <Activity className="h-3 w-3 text-red-500" />
          <span className="text-xs font-medium text-red-600">Inactivos</span>
        </div>
        <div className="opacity-80">
          <Sparkline data={[1, 3, 2, 4, 3, 2, inactiveProviders]} color="#ef4444" />
        </div>
      </div>
    </div>
  </div>

  {/* 4. Inversión Total (NUEVA) */}
  <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
    <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Inversión Total</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">${totalInvestment.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-violet-500/10 p-2.5">
          <Wallet className="h-5 w-5 text-violet-600" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-violet-500" />
          <span className="text-xs font-medium text-violet-600">Capital en stock</span>
        </div>
        <div className="opacity-80">
          <Sparkline data={[4000, 5500, 4800, 6000, 7500, 7000, totalInvestment]} color="#8b5cf6" />
        </div>
      </div>
    </div>
  </div>

  {/* 5. Beneficio Neto (NUEVA) */}
  <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Beneficio Neto</p>
          <p className="text-3xl font-bold tracking-tight text-amber-600">${netProfit.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-amber-500/10 p-2.5">
          <TrendingUp className="h-5 w-5 text-amber-600" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-xs font-medium text-amber-600">Margen proyectado</span>
        </div>
        <div className="opacity-80">
          <Sparkline data={[1200, 1500, 1800, 1600, 2100, 2500, netProfit]} color="#f59e0b" />
        </div>
      </div>
    </div>
  </div>

  {/* 6. Status (NUEVA) */}
  <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
    <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Estado de Cuenta</p>
          <p className="text-2xl font-black tracking-tight text-foreground uppercase mt-1">{status}</p>
        </div>
        <div className="rounded-xl bg-sky-500/10 p-2.5">
          <ShieldCheck className="h-5 w-5 text-sky-600" />
        </div>
      </div>
      <div className="flex justify-between items-end mt-4">
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-bold text-sky-600 bg-sky-50 dark:bg-sky-500/10 px-2 py-0.5 rounded-full">Sincronizado</span>
        </div>
        <div className="opacity-80">
          <Sparkline data={[5, 5, 5, 5, 5, 5, 5]} color="#0ea5e9" />
        </div>
      </div>
    </div>
  </div>

</div>

    {/* <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 animate-slide-up"> */}
        
        {/* Total Proveedores */}
        {/* <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Red de Suministro</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">{totalProviders}</p>
              </div>
              <div className="rounded-xl bg-indigo-500/10 p-2.5 transition-transform group-hover:rotate-12">
                <Building2 className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-indigo-500" />
                <span className="text-xs font-medium text-indigo-600">Registrados</span>
              </div>
              <div className="opacity-80">
                <Sparkline data={[totalProviders-2, totalProviders-1, totalProviders]} color="#6366f1" />
              </div>
            </div>
          </div>
        </div> */}

        {/* Proveedores Activos */}
        {/* <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-border/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Capacidad Activa</p>
                <p className="text-3xl font-bold tracking-tight text-emerald-600">{activeProviders}</p>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-2.5">
                <Globe className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-600">Operativos</span>
              </div>
              <div className="opacity-80">
                <Sparkline data={[10, 12, 11, 13, 12, 14, activeProviders]} color="#10b981" />
              </div>
            </div>
          </div>
        </div> */}

        {/* Proveedores Inactivos */}
        {/* <div className="group kpi-card relative overflow-hidden bg-white dark:bg-zinc-950 p-5 rounded-2xl border border-red-100/50">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -translate-y-8 translate-x-8 group-hover:scale-110 transition-transform duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-red-500/80 uppercase tracking-wider">Fuera de Servicio</p>
                <p className="text-3xl font-bold tracking-tight text-red-600">{inactiveProviders}</p>
              </div>
              <div className="rounded-xl bg-red-500/10 p-2.5 transition-all group-hover:bg-red-500/20">
                <Ban className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="flex justify-between items-end mt-4">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3 text-red-500" />
                <span className="text-xs font-medium text-red-600">Inactivos</span>
              </div>
              <div className="opacity-80">
                <Sparkline data={[1, 3, 2, 4, 3, 2, inactiveProviders]} color="#ef4444" />
              </div>
            </div>
          </div>
        </div>
      </div> */}
          

  <div className="flex flex-col md:flex-row gap-4 items-center animate-slide-up" style={{ animationDelay: "100ms" }}>
    
    {/* Buscador - Ahora ocupa el espacio flexible */}
    <div className="relative flex-1 w-full">
      <div className="relative flex items-center rounded-xl border border-slate-200 bg-white h-11 w-full shadow-sm focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/30 transition-all duration-200">
        <Search className="absolute left-4 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Buscar por nombre, contacto o identificación..." 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          className="pl-11 pr-4 h-full w-full text-sm border-none bg-transparent shadow-none focus-visible:ring-0" 
        />
      </div>
    </div>

    {/* Grupo de Acciones de Filtro */}
    {/* <div className="flex items-center gap-2 w-full md:w-auto">
      
    
      <Button variant="outline" className="flex-1 md:flex-none h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 px-4">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sliders-horizontal"><path d="M21 4h-7"/><path d="M10 4H3"/><path d="M12 4v4"/><path d="M12 0v4"/><path d="M21 12H11"/><path d="M7 12H3"/><path d="M9 8v8"/><path d="M21 20H15"/><path d="M11 20H3"/><path d="M13 16v8"/></svg>
        </div>
        <span className="text-sm font-medium">Filtros</span>
      </Button>

    
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex-1 md:flex-none h-11 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 gap-2 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="m21 8-4-4-4 4"/><path d="M17 4v16"/></svg>
            <span className="text-sm font-medium">Ordenar</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Nombre (A-Z)</DropdownMenuItem>
          <DropdownMenuItem>Nombre (Z-A)</DropdownMenuItem>
          <DropdownMenuItem>Más productos</DropdownMenuItem>
          <DropdownMenuItem>Recientes</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

    </div> */}
        <Button className="blue-900 hover:bg-blue-800 shadow-md transition-all active:scale-95" onClick={openNewRestarStock}>
             Rellenar stock
        </Button>

          <Button className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20" onClick={openNewProvider}>
             {/* <Plus className="mr-2 h-4 w-4" /> */}
            Agregar Proveedor
          </Button>
      </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((prov, index) => (
          <div
            key={prov.id}
            className="group relative rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-slide-up"
            style={{ animationDelay: `${(index + 2) * 50}ms` }}
          >
            {/* Badge de Estado - Esquina Superior Derecha */}
            <div className="absolute top-6 right-6">
              <Badge 
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  prov.isActive 
                    ? "bg-emerald-500 hover:bg-emerald-500 text-white" 
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {prov.isActive ? "Activo" : "Inactivo"}
              </Badge>
            </div>

            {/* Header: Icono y Nombre */}
            <div className="flex items-start gap-4 mb-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100">
                <Building2 className="h-8 w-8 text-slate-400" />
              </div>
              <div className="pr-16"> 
                <h3 className="text-lg font-bold text-slate-800 leading-tight">{prov.name}</h3>
                <p className="text-sm text-slate-500 mt-1">Contacto: {prov.contactName}</p>
              </div>
            </div>

            {/* Información de Contacto con Iconos */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm truncate">{prov.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm">{prov.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-sm truncate">{prov.address}</span>
              </div>
            </div>

            {/* Footer: Productos y Acciones */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Productos suministrados:</span>
                <span className="flex items-center justify-center bg-indigo-50 text-indigo-600 font-semibold text-xs px-3 py-1 rounded-full">
                  {prov.productCount}
                </span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                  onClick={() => openEdit(prov)}
                >
                  <Edit className="h-[18px] w-[18px]" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 text-slate-400 hover:text-destructive hover:bg-destructive/5 transition-colors"
                  onClick={() => handleDelete(prov.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-[18px] w-[18px]" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Para rellenar stock */}
            <Dialog open={dialogStockOpen} onOpenChange={setDialogStockOpen}>
              <DialogContent className="max-w-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    {editingStock ? "Actualizar Stock" : "Rellenar Stock"}
                  </DialogTitle>
                </DialogHeader>
                
                {product && (
                <RestartStockForm
                  restartStock={{ productId: "new" } as CreateRestartStock}
                  products={product}
                  isPending={mutationStock.isPending}
                  onSubmit={async (data) => {
                    try {
                      console.log("FINAL DATA:", data);
      
                      await mutationStock.mutateAsync(data); // FIX REAL
      
                      setDialogStockOpen(false);
                      toast.success(editing ? 'Venta actualizada' : 'Stock Rellenado correctamente');
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                />
                )}
              </DialogContent>
            </Dialog>
      
      {/* Modal de proveedores  */}
      <Dialog open={dialogProviderOpen} onOpenChange={setDialogProviderOpen}>
      <DialogContent>
          <DialogHeader>
          <DialogTitle>
              {editing ? "Actualizar Proveedores" : "Nuevo Proveedor"}
          </DialogTitle>
          </DialogHeader>

          <ProviderForm
          provider={editing ?? ({ id: "new" } as Provider)}
          isPending={mutation.isPending}
          onSubmit={async (data) => {
              try {
              await mutation.mutateAsync({
                  ...data,
                  id: editing ? editing.id : undefined,
              });

              setDialogProviderOpen(false);

              toast.success(editing ? 'Proveedor actualizado correctamente' 
                  : 'Proveedor creado correctamente', {
                  position: 'bottom-right',
                  });

              } catch (error) {
              console.error(error);
              }
          }}
          />
      </DialogContent>
      </Dialog>   

      </div>
    );
  }
