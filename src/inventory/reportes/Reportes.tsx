import { useState, useMemo } from "react";
import { Download, Calendar, TrendingUp, ArrowDownRight, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, Cell 
} from "recharts";
import type { Sale } from "@/interface/sales/sale.interface";
import { useSales } from "../ventas/hooks/useSales";
import { useProducts } from "../productos/hooks/useProducts";
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreemLoading";
import { exportReportPDF } from "@/lib/exportToPdf";

// Tipos auxiliares corregidos
type ChartData = { week: string; ventas: number; };
type TopProduct = { name: string; ventas: number; ingresos: number; };
type LowRotation = { name: string; ventas: number; ultimaVenta: string; };

export const Reportes = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [startDate, setStartDate] = useState(firstDay.toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(lastDay.toISOString().split("T")[0]);

  const { data: salesDataHook, isLoading } = useSales();
  const { data: productsData } = useProducts();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const salesList: Sale[] = (salesDataHook?.data.sales ?? []) as Sale[];
  const stats = salesDataHook?.data.stats;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const productList = productsData?.data ?? [];

  

  const isInvalidRange = new Date(startDate) > new Date(endDate);

  const filteredSales: Sale[] = useMemo(() => {
    return salesList.filter((s) => {
      const date = new Date(s.registerDate);
      return date >= new Date(startDate) && date <= new Date(endDate);
    });
  }, [salesList, startDate, endDate]);

  const salesChartData: ChartData[] = useMemo(() => {
    return filteredSales.reduce<ChartData[]>((acc, sale) => {
      const date = new Date(sale.registerDate);
      const week = `Sem ${Math.ceil(date.getDate() / 7)}`;
      const existing = acc.find((item) => item.week === week);
      if (existing) { existing.ventas += sale.totalPrice; } 
      else { acc.push({ week, ventas: sale.totalPrice }); }
      return acc;
    }, []);
  }, [filteredSales]);

  const topProducts: TopProduct[] = useMemo(() => {
    const grouped = filteredSales.reduce<Record<string, TopProduct>>((acc, sale) => {
      const key = sale.productId;
      if (!acc[key]) {
        acc[key] = { name: sale.Product.name, ventas: 0, ingresos: 0 };
      }
      acc[key].ventas += sale.quantity;
      acc[key].ingresos += sale.totalPrice;
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => b.ventas - a.ventas).slice(0, 5);
  }, [filteredSales]);

  const lowRotation: LowRotation[] = useMemo(() => {
    return productList.map((product) => {
      const productSales = filteredSales.filter((s) => s.productId === product.id);
      const lastSale = productSales.map((s) => new Date(s.registerDate)).sort((a, b) => b.getTime() - a.getTime())[0];
      
      const daysAgo = lastSale ? Math.floor((Date.now() - lastSale.getTime()) / (1000 * 60 * 60 * 24)) : null;
      return {
        name: product.name,
        ventas: productSales.length,
        ultimaVenta: lastSale ? `Hace ${daysAgo} días` : "Sin ventas",
      };
    }).sort((a, b) => a.ventas - b.ventas).slice(0, 4);
  }, [filteredSales, productList]);

  if (isLoading) return <CustomFullScreenLoading />;

  return (
    <div id="report-container" className="max-w-[1200px] mx-auto space-y-8 p-6 animate-fade-in">
      
      {/* HEADER SECTION */}
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Reportes</h1>
          <p className="text-muted-foreground text-sm">Análisis estadístico de ventas e inventario</p>
        </div>
        <Button 
          className="rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          onClick={() => exportToPDF("report-container", "reporte-ventas.pdf")}
        >
          <Download className="mr-2 h-4 w-4" /> Exportar PDF
        </Button>
      </div> */}

        {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-950">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Ingresos Totales</p>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600"><TrendingUp className="h-4 w-4"/></div>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
            ${new Intl.NumberFormat().format(stats?.totalRevenue ?? 0)}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">Revenue acumulado</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-950">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Completadas</p>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600"><Package className="h-4 w-4"/></div>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-emerald-600">
            {stats?.totalCompleted ?? 0}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">Ventas exitosas</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:bg-zinc-950">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Ventas del Mes</p>
            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600"><TrendingUp className="h-4 w-4"/></div>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-amber-600">
            {stats?.currentMonthSalesCount ?? 0}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-2 font-medium">Periodo actual</p>
        </div>
      </div>
      
      {/* FILTER BAR - Premium Glass Style */}
      
      <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-border/50 p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 bg-background border rounded-xl px-3 py-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground mr-2 text-nowrap">Rango de fechas:</span>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border-none shadow-none h-8 p-0 w-32 focus-visible:ring-0" />
          <span className="text-muted-foreground mx-1">a</span>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border-none shadow-none h-8 p-0 w-32 focus-visible:ring-0" />
        </div>
        <Button variant="secondary" className="rounded-xl ml-auto px-6 h-10 font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50" disabled={isInvalidRange}>
          Aplicar
        </Button>

        <Button 
          className="rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          onClick={() => 
            exportReportPDF({
              startDate,
              endDate,
              salesChartData,
              topProducts,
              lowRotation
            })}
        >
          <Download className="mr-2 h-4 w-4" /> Exportar PDF
        </Button>
      </div>

    

      {/* CHARTS SECTION */}
      <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-black tracking-tight">Ventas por Semana</CardTitle>
              <CardDescription>Tendencia de ingresos en el período seleccionado</CardDescription>
            </div>
            <div className="text-emerald-500 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full text-xs">
              <TrendingUp className="h-3 w-3" /> +68%
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[350px] pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesChartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} tickFormatter={(v) => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                formatter={(val) => [`$${new Intl.NumberFormat().format(Number(val))}`, 'Ventas']}
              />
              <Area type="monotone" dataKey="ventas" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* BOTTOM SECTION: TOP PRODUCTS & LOW ROTATION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Products Chart */}
        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">Top Productos Más Vendidos</CardTitle>
            <CardDescription>Productos con mayor demanda</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }} >
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 11}} width={120} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.03)'}} contentStyle={{borderRadius: '10px'}} />
                <Bar dataKey="ventas" fill="#6366f1" radius={[0, 8, 8, 0]} barSize={32} isAnimationActive={false}>
                  {topProducts.map((_, index) => (
                    <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.15} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Low Rotation List */}
        <Card className="rounded-2xl border-border/50 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-black tracking-tight">Productos con Baja Rotación</CardTitle>
            <CardDescription>Productos que necesitan estrategias de venta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              {lowRotation.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border/40 hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-600 font-black dark:bg-rose-500/10">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-200">{p.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{p.ultimaVenta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-rose-500 font-bold text-sm">
                    <ArrowDownRight className="h-4 w-4" /> {p.ventas} ventas
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
